"""Utilities for testing Cairo contracts."""
from collections import namedtuple
from pathlib import Path
import math
import asyncio
import site
from starkware.cairo.common.hash_state import compute_hash_on_elements
from starkware.crypto.signature.signature import private_to_stark_key, sign
from starkware.starknet.business_logic.state.state import BlockInfo
from starkware.starknet.public.abi import get_selector_from_name
from starkware.starknet.compiler.compile import compile_starknet_files
from starkware.starkware_utils.error_handling import StarkException
from starkware.starknet.testing.starknet import StarknetContract
from starkware.starknet.business_logic.execution.objects import Event
from starkware.crypto.signature.fast_pedersen_hash import pedersen_hash

MAX_UINT256 = (2 ** 128 - 1, 2 ** 128 - 1)
INVALID_UINT256 = (MAX_UINT256[0] + 1, MAX_UINT256[1])
ZERO_ADDRESS = 0
TRUE = 1
FALSE = 0

TRANSACTION_VERSION = 0

_root = Path(__file__).parent.parent


def contract_path(name):
    if name.startswith("openzeppelin"):
        return site.getsitepackages()[0] + "/" + name
    elif name.startswith("tests/"):
        return str(_root / name)
    elif name.startswith('/'):
        return str(_root / "contracts" / name[1:])
    else:
        return str(_root / "contracts" / name)


def str_to_felt(text):
    b_text = bytes(text, "ascii")
    return int.from_bytes(b_text, "big")


def felt_to_str(felt):
    b_felt = felt.to_bytes(31, "big")
    return b_felt.decode()


def assert_event_emitted(tx_exec_info, from_address, name, data):
    assert Event(
        from_address=from_address,
        keys=[get_selector_from_name(name)],
        data=data,
    ) in tx_exec_info.raw_events


def uint(a):
    return (a, 0)


def to_uint(a):
    """Takes in value, returns uint256-ish tuple."""
    return (a & ((1 << 128) - 1), a >> 128)


def to_uint_typed(a):
    Uint256 = namedtuple("Uint256", "low high")
    return Uint256(low=a & ((1 << 128) - 1), high=a >> 128)


def from_uint(uint):
    """Takes in uint256-ish tuple, returns value."""
    return uint[0] + (uint[1] << 128)


def add_uint(a, b):
    """Returns the sum of two uint256-ish tuples."""
    a = from_uint(a)
    b = from_uint(b)
    c = a + b
    return to_uint(c)


def sub_uint(a, b):
    """Returns the difference of two uint256-ish tuples."""
    a = from_uint(a)
    b = from_uint(b)
    c = a - b
    return to_uint(c)


def mul_uint(a, b):
    """Returns the product of two uint256-ish tuples."""
    a = from_uint(a)
    b = from_uint(b)
    c = a * b
    return to_uint(c)


def div_rem_uint(a, b):
    """Returns the quotient and remainder of two uint256-ish tuples."""
    a = from_uint(a)
    b = from_uint(b)
    c = math.trunc(a / b)
    m = a % b
    return (to_uint(c), to_uint(m))


async def assert_revert(fun, reverted_with=None, error_code=None):
    try:
        await fun
        assert False
    except StarkException as err:
        _, error = err.args
        if reverted_with is not None:
            assert reverted_with in error['message']

        if error_code is not None:
            assert error['code'] == error_code


def get_contract_def(path):
    """Returns the contract definition from the contract path"""
    path = contract_path(path)
    contract_def = compile_starknet_files(
        files=[path],
        debug_info=True,
        disable_hint_validation=True
    )
    return contract_def


def cached_contract(state, definition, deployed):
    """Returns the cached contract"""
    contract = StarknetContract(
        state=state,
        abi=definition.abi,
        contract_address=deployed.contract_address,
        deploy_execution_info=deployed.deploy_execution_info
    )
    return contract


class Signer:
    """
    Utility for sending signed transactions to an Account on Starknet.
    Parameters
    ----------
    private_key : int
    Examples
    ---------
    Constructing a Signer object
    >>> signer = Signer(1234)
    Sending a transaction
    >>> await signer.send_transaction(account,
                                      account.contract_address,
                                      'set_public_key',
                                      [other.public_key]
                                     )
    """

    def __init__(self, private_key):
        self.private_key = private_key
        self.public_key = private_to_stark_key(private_key)

    def sign(self, message_hash):
        return sign(msg_hash=message_hash, priv_key=self.private_key)

    async def send_transaction(self, account, to, selector_name, calldata, nonce=None, max_fee=0):
        return await self.send_transactions(account, [(to, selector_name, calldata)], nonce, max_fee)

    async def send_transactions(self, account, calls, nonce=None, max_fee=0):
        if nonce is None:
            execution_info = await account.get_nonce().call()
            nonce, = execution_info.result

        calls_with_selector = [
            (call[0], get_selector_from_name(call[1]), call[2]) for call in calls]
        (call_array, calldata) = from_call_to_call_array(calls)

        message_hash = hash_multicall(
            account.contract_address, calls_with_selector, nonce, max_fee)
        sig_r, sig_s = self.sign(message_hash)

        return await account.__execute__(call_array, calldata, nonce).invoke(signature=[sig_r, sig_s])


def from_call_to_call_array(calls):
    call_array = []
    calldata = []
    for i, call in enumerate(calls):
        assert len(call) == 3, "Invalid call parameters"
        entry = (call[0], get_selector_from_name(
            call[1]), len(calldata), len(call[2]))
        call_array.append(entry)
        calldata.extend(call[2])
    return (call_array, calldata)


def hash_multicall(sender, calls, nonce, max_fee):
    hash_array = []
    for call in calls:
        call_elements = [call[0], call[1], compute_hash_on_elements(call[2])]
        hash_array.append(compute_hash_on_elements(call_elements))

    message = [
        str_to_felt('StarkNet Transaction'),
        sender,
        compute_hash_on_elements(hash_array),
        nonce,
        max_fee,
        TRANSACTION_VERSION
    ]
    return compute_hash_on_elements(message)


def get_block_timestamp(starknet_state):
    return starknet_state.state.block_info.block_timestamp


def set_block_timestamp(starknet_state, timestamp):
    starknet_state.state.block_info = BlockInfo.create_for_testing(
        starknet_state.state.block_info.block_number, timestamp
    )


def get_block_number(starknet_state):
    return starknet_state.state.block_info.block_number


def set_block_number(starknet_state, block_number):
    starknet_state.state.block_info = BlockInfo.create_for_testing(
        block_number, starknet_state.state.block_info.block_timestamp
    )


def assert_approx_eq(a: int, b: int, max_delta: int):
    delta = a - b if a > b else b - a

    if delta > max_delta:
        print(f"a: {a}")
        print(f"b: {b}")
        print(f"delta: {delta}")
        assert False
    assert True


def get_next_level(level):
    next_level = []

    for i in range(0, len(level), 2):
        node = 0
        if level[i] < level[i + 1]:
            node = pedersen_hash(level[i], level[i + 1])
        else:
            node = pedersen_hash(level[i + 1], level[i])

        next_level.append(node)

    return next_level


def generate_proof_helper(level, index, proof):
    if len(level) == 1:
        return proof
    if len(level) % 2 != 0:
        level.append(0)

    next_level = get_next_level(level)
    index_parent = 0

    for i in range(0, len(level)):
        if i == index:
            index_parent = i // 2
            if i % 2 == 0:
                proof.append(level[index + 1])
            else:
                proof.append(level[index - 1])

    return generate_proof_helper(next_level, index_parent, proof)


def generate_merkle_proof(values, index):
    return generate_proof_helper(values, index, [])


def generate_merkle_root(values):
    if len(values) == 1:
        return values[0]

    if len(values) % 2 != 0:
        values.append(0)

    next_level = get_next_level(values)
    return generate_merkle_root(next_level)


def verify_merkle_proof(leaf, proof):
    root = proof[len(proof) - 1]
    proof = proof[:-1]
    curr = leaf

    for proof_elem in proof:
        if curr < proof_elem:
            curr = pedersen_hash(curr, proof_elem)
        else:
            curr = pedersen_hash(proof_elem, curr)

    return curr == root


def get_leaf(recipient, amount):
    # amount_hash = pedersen_hash(amount, 0)
    leaf = pedersen_hash(recipient, amount)
    return leaf


# creates the inital merkle leaf values to use


def get_leaves(recipients, amounts):
    values = []
    for i in range(0, len(recipients)):
        leaf = get_leaf(recipients[i], amounts[i])
        value = (leaf, recipients[i], amounts[i])
        values.append(value)

    if len(values) % 2 != 0:
        last_value = (0, 0, 0)
        values.append(last_value)

    return values