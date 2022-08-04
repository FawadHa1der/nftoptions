import inspect
import os
import pytest
import openzeppelin
import asyncio
from datetime import datetime
import time    

from starkware.starknet.testing.starknet import Starknet
from signers import MockSigner
from starkware.starknet.business_logic.state.state import BlockInfo

from starkware.starknet.testing.starknet import Starknet
from starkware.starknet.compiler.compile import compile_starknet_files
from utils import (
    Signer, uint, to_uint, add_uint, sub_uint, str_to_felt, MAX_UINT256, ZERO_ADDRESS, INVALID_UINT256,
    TRUE, get_contract_def, cached_contract, assert_revert, assert_event_emitted, contract_path
)

epoch_time = int(time.time())

CONTRACT_FILE = os.path.join("contracts", "erc721_option.cairo")

signer = MockSigner(1234)

# random token IDs
TOKENS = [
    to_uint(5042), to_uint(793), to_uint(321), MAX_UINT256, to_uint(8)
]
# total tokens as uint
TOTAL_TOKENS = to_uint(len(TOKENS))
# random user address
RECIPIENT = 555
# random data (mimicking bytes in Solidity)
DATA = [0x42, 0x89, 0x55]
# selector id
ENUMERABLE_INTERFACE_ID = 0x780e9d63
EXPIRY_DATE = epoch_time + (3*86400) # 3 days from now
BID = uint(10000)
PREMIUM = uint(5000)
NULL_BUYERS_ADDRESS = 734597439539
NULL_SELLERS_ADDRESS = 4758947594379
DEFAULT_TIMESTAMP = 1640991600
ONE_DAY = 86400


def get_oz_lib_def(path):
    """Returns the contract definition from libraries"""
    path = os.path.abspath(os.path.dirname(
        inspect.getfile(openzeppelin))) + "/" + path
    contract_def = compile_starknet_files(
        files=[path],
        debug_info=True
    )
    return contract_def


@pytest.fixture(scope='module')
def contract_defs():
    # account_def = get_contract_def('./openzeppelin/account/Account.cairo')
    account_def = get_contract_def('openzeppelin/account/Account.cairo')
    erc20_def = get_contract_def(
        'openzeppelin/token/erc20/ERC20.cairo')
    erc721Option_def = get_contract_def(
        'erc721_option.cairo')
    erc721_def = get_contract_def(
        'openzeppelin/token/erc721/ERC721_Mintable_Burnable.cairo')

    return account_def, erc20_def, erc721_def, erc721Option_def


RECIPIENT = 123
INIT_SUPPLY = to_uint(100000000)
AMOUNT = to_uint(200)
UINT_ONE = to_uint(1)
UINT_ZERO = to_uint(0)
NAME = str_to_felt("Token")
SYMBOL = str_to_felt("TKN")
DECIMALS = 18


@pytest.fixture(scope='module')
async def erc721_init(contract_defs):
    account_def, erc20_def, erc721_def, erc721Option_def = contract_defs

    starknet = await Starknet.empty()
    # await starknet.deploy(contract_def=account_def, constructor_calldata=[signer.public_key])
    update_starknet_block(
    starknet, block_timestamp=DEFAULT_TIMESTAMP)

    account1 = await starknet.deploy(contract_class=account_def, constructor_calldata=[signer.public_key])
    account2 = await starknet.deploy(
        contract_class=account_def,
        constructor_calldata=[signer.public_key]
    )

    erc20 = await starknet.deploy(
        contract_class=erc20_def,
        constructor_calldata=[
            NAME,
            SYMBOL,
            DECIMALS,
            *INIT_SUPPLY,
            account1.contract_address,        # recipient
        ]
    )
    # await signer.send_transaction(
    #     account1, erc20.contract_address, 'transfer', [
    #         account2.contract_address,
    #         *to_uint(40000)
    #     ])
    erc721 = await starknet.deploy(
        contract_class=erc721_def,
        constructor_calldata=[
            str_to_felt("Non Fungible Token"),  # name
            str_to_felt("NFT"),                 # ticker
            account1.contract_address           # owner
        ]
    )
    erc721Option = await starknet.deploy(
        contract_class=erc721Option_def,
        constructor_calldata=[
                       # owner
        ]
    )

    return (
        starknet,
        starknet.state,
        account1,
        account2,
        erc721,
        erc20,
        erc721Option
    )


@pytest.fixture(scope='module')
async def erc721_factory(contract_defs, erc721_init):
    account_def, erc20_def, erc721_def, erc721Option_def = contract_defs
    starknet, state, account1, account2, erc721, erc20, erc721Option = await erc721_init
    _state = state.copy()
    starknet.state = _state
    account1 = cached_contract(_state, account_def, account1)
    account2 = cached_contract(_state, account_def, account2)
    erc721 = cached_contract(_state, erc721_def, erc721)
    erc20 = cached_contract(_state, erc20_def, erc20)
    erc721Option = cached_contract(_state, erc721Option_def, erc721Option)

    return starknet, account1, account2, erc721, erc20, erc721Option


@pytest.fixture(scope='module')
async def erc721_minted(erc721_factory):
    starknet, account1, account2, erc721, erc20, erc721Option = await erc721_factory
    # mint tokens to account
    for token in TOKENS:
        await signer.send_transaction(
            account1, erc721.contract_address, 'mint', [
                account1.contract_address, *token]
        )
        await signer.send_transaction(
            account1, erc721.contract_address, 'approve', [
                erc721Option.contract_address, *token]
        )

    # return_bool = await signer.send_transaction(account1, erc20Weth.contract_address, 'approve', [ricks.contract_address, *bid_256])

    await signer.send_transaction(
        account1, erc20.contract_address, 'approve', [
            erc721Option.contract_address,
            *to_uint(10000000)
        ])

    await signer.send_transaction(
        account2, erc20.contract_address, 'approve', [
            erc721Option.contract_address,
            *to_uint(10000000)
        ])

    await signer.send_transaction(
        account1, erc20.contract_address, 'transfer', [
            account2.contract_address,
            *to_uint(400000)
        ])
    await signer.send_transaction(
    account1, erc721Option.contract_address, 'initializer', [
        account1.contract_address, erc20.contract_address]
    )

    return starknet, account1, account2, erc721, erc20, erc721Option



def update_starknet_block(starknet, block_number=1, block_timestamp= ONE_DAY):
    starknet.state.state.block_info = BlockInfo(
        block_number=block_number, block_timestamp=block_timestamp, 
        gas_price=starknet.state.state.block_info.gas_price,
        sequencer_address=starknet.state.state.block_info.sequencer_address, 
        starknet_version=starknet.state.state.block_info.starknet_version )


@pytest.fixture(scope="module")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()

@pytest.mark.asyncio
async def test_cancel_bid(erc721_minted):
    starknet, account1, account2, erc721, erc20, erc721Option = await erc721_minted
    
    execution_info = await erc20.balanceOf(account1.contract_address).call()
    initialAccount1Balance = execution_info.result.balance[0]

    execution_info = await erc20.balanceOf(account2.contract_address).call()
    initialAccount2Balance = execution_info.result.balance[0]

    tx_exec_info = await signer.send_transaction(
        account1, erc721Option.contract_address, 'register_put_bid', [
            DEFAULT_TIMESTAMP + (ONE_DAY * 3),
            erc721.contract_address,
            *(TOKENS[0]),
            *PREMIUM,
            *BID,
        ])
    assert tx_exec_info.result.response == [0]

    tx_exec_info = await signer.send_transaction(
        account1, erc721Option.contract_address, 'register_put_bid', [
            DEFAULT_TIMESTAMP + (ONE_DAY * 3),
            erc721.contract_address,
            *(TOKENS[1]),
            *PREMIUM,
            *BID,
        ])

    assert tx_exec_info.result.response == [1]
    BID_ID = tx_exec_info.result.response[0]

    execution_info1 = await erc721Option.view_bids_buyer(account1.contract_address).call()
    print(f" view_bids_buyer results to {execution_info1.result}")

    execution_info1 = await erc721Option.view_bids_seller(account1.contract_address).call()
    print(f" view_bids_seller results to {execution_info1.result}")

    execution_info1 = await erc721Option.view_bids_count().call()
    print(f"view_bids_count results to {execution_info1.result.bids_count}")
    assert execution_info1.result.bids_count == 2

    execution_info1 = await erc721Option.view_all_bids().call()
    print(f"view_bids_all results to {execution_info1.result}")
    assert len(execution_info1.result.bids) == 2

    tx_exec_info = await signer.send_transaction(
        account1, erc721Option.contract_address, 'cancel_put_bid', [
           BID_ID ])

    assert tx_exec_info.result.response == [1]


# @pytest.mark.asyncio
# async def test_view_bids(erc721_minted):
#     starknet, account1, account2, erc721, erc20, erc721Option = await erc721_minted
    
#     execution_info = await erc20.balanceOf(account1.contract_address).call()
#     initialAccount1Balance = execution_info.result.balance[0]

#     execution_info = await erc20.balanceOf(account2.contract_address).call()
#     initialAccount2Balance = execution_info.result.balance[0]

#     tx_exec_info = await signer.send_transaction(
#         account1, erc721Option.contract_address, 'register_put_bid', [
#             DEFAULT_TIMESTAMP + (ONE_DAY * 3),
#             erc721.contract_address,
#             *(TOKENS[0]),
#             *PREMIUM,
#             *BID,
#         ])
#     assert tx_exec_info.result.response == [0]

#     tx_exec_info = await signer.send_transaction(
#         account1, erc721Option.contract_address, 'register_put_bid', [
#             DEFAULT_TIMESTAMP + (ONE_DAY * 3),
#             erc721.contract_address,
#             *(TOKENS[1]),
#             *PREMIUM,
#             *BID,
#         ])

#     assert tx_exec_info.result.response == [1]
#     BID_ID = tx_exec_info.result.response[0]

#     execution_info1 = await erc721Option.view_bids_buyer(account1.contract_address).call()
#     print(f" view_bids_buyer results to {execution_info1.result}")

#     execution_info1 = await erc721Option.view_bids_seller(account1.contract_address).call()
#     print(f" view_bids_seller results to {execution_info1.result}")

#     execution_info1 = await erc721Option.view_bids_count().call()
#     print(f"view_bids_count results to {execution_info1.result.bids_count}")
#     assert execution_info1.result.bids_count == 2

#     execution_info1 = await erc721Option.view_all_bids().call()
#     print(f"view_bids_all results to {execution_info1.result}")
#     assert len(execution_info1.result.bids) == 2

# @pytest.mark.asyncio
# async def test_open_bid(erc721_minted):
#     starknet, account1, account2, erc721, erc20, erc721Option = await erc721_minted
    
#     execution_info = await erc20.balanceOf(account1.contract_address).call()
#     initialAccount1Balance = execution_info.result.balance[0]

#     execution_info = await erc20.balanceOf(account2.contract_address).call()
#     initialAccount2Balance = execution_info.result.balance[0]

#     tx_exec_info = await signer.send_transaction(
#         account1, erc721Option.contract_address, 'register_put_bid', [
#             DEFAULT_TIMESTAMP + (ONE_DAY * 3),
#             erc721.contract_address,
#             *(TOKENS[0]),
#             *PREMIUM,
#             *BID,
#         ])
#     assert tx_exec_info.result.response == [0]
#     BID_ID = tx_exec_info.result.response[0]

#     execution_info1 = await erc721Option.view_bids_buyer(account1.contract_address).call()
#     print(f"results to {execution_info1.result}")

#     execution_info1 = await erc721Option.view_bids_seller(account1.contract_address).call()
#     print(f"results to {execution_info1.result}")

#     execution_info = await erc20.balanceOf(account1.contract_address).call()
#     assert initialAccount1Balance - PREMIUM[0]  == execution_info.result.balance[0]

#     execution_info = await erc20.balanceOf(erc721Option.contract_address).call()
#     assert PREMIUM[0]  == execution_info.result.balance[0]

#     tx_exec_info = await signer.send_transaction(
#         account2, erc721Option.contract_address, 'register_put_sell', [
#         tx_exec_info.result.response[0]])
#     assert tx_exec_info.result.response == [1]

#     execution_info = await erc20.balanceOf(account2.contract_address).call()
#     assert initialAccount2Balance - BID[0] + PREMIUM[0] == execution_info.result.balance[0]

#     execution_info = await erc20.balanceOf(erc721Option.contract_address).call()
#     assert BID[0] == execution_info.result.balance[0]
#     execution_info = await erc721.ownerOf(TOKENS[0]).call()
#     print(f"before exercise put erc721.ownerOf(TOKENS[0]).call() {execution_info.result.owner}")
 
#     tx_exec_info = await signer.send_transaction(
#     account1, erc721Option.contract_address, 'exercise_put', [
#     BID_ID])
#     assert tx_exec_info.result.response == [1]

#     execution_info = await erc20.balanceOf(erc721Option.contract_address).call()
#     assert 0 == execution_info.result.balance[0]

#     execution_info = await erc20.balanceOf(account1.contract_address).call()
#     assert initialAccount1Balance + BID[0] - PREMIUM[0] == execution_info.result.balance[0]

#     execution_info = await erc721.balanceOf(account1.contract_address).call()
#     assert 4 == execution_info.result.balance[0]

#     execution_info = await erc721.balanceOf(account2.contract_address).call()
#     assert 1 == execution_info.result.balance[0]

#     execution_info = await erc721.ownerOf(TOKENS[0]).call()
#     print(f"erc721.ownerOf(TOKENS[0]).call() {execution_info.result.owner}")
#     print(f"account2.contract_address {account2.contract_address}")

#     assert account2.contract_address == execution_info.result.owner

# @pytest.mark.asyncio
# async def test_expiry_time(erc721_minted):
#     starknet, account1, account2, erc721, erc20, erc721Option = await erc721_minted
    
#     execution_info = await erc20.balanceOf(account1.contract_address).call()
#     initialAccount1Balance = execution_info.result.balance[0]

#     execution_info = await erc20.balanceOf(account2.contract_address).call()
#     initialAccount2Balance = execution_info.result.balance[0]

#     tx_exec_info = await signer.send_transaction(
#         account1, erc721Option.contract_address, 'register_put_bid', [
#             DEFAULT_TIMESTAMP + (ONE_DAY * 3),
#             erc721.contract_address,
#             *(TOKENS[0]),
#             *PREMIUM,
#             *BID,
#         ])
#     assert tx_exec_info.result.response == [0]
#     BID_ID = tx_exec_info.result.response[0]

#     update_starknet_block(starknet, block_timestamp=DEFAULT_TIMESTAMP +(ONE_DAY * 4))
    
 
#     await assert_revert(signer.send_transaction(
#         account2, erc721Option.contract_address, 'register_put_sell', [
#         tx_exec_info.result.response[0]])
#     , reverted_with="current time is past the expiry date of the option")

