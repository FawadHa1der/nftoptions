import inspect
import os
import pytest
import openzeppelin
import asyncio

from starkware.starknet.testing.starknet import Starknet
from starkware.starknet.compiler.compile import compile_starknet_files
from utils import (
    Signer, MockSigner, str_to_felt, MAX_UINT256, get_contract_def, cached_contract,
    TRUE, assert_revert, to_uint, sub_uint, add_uint
)
CONTRACT_FILE = os.path.join("contracts", "erc721_option.cairo")
ERC20_FILE = os.path.join("contracts", "erc721_option.cairo")

signer = Signer(123456789987654321)

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
    account_def = get_oz_lib_def('account/Account.cairo')
    erc20_def = get_oz_lib_def(
        'token/erc20/ERC20.cairo')
    erc721Option_def = get_contract_def(
        CONTRACT_FILE)
    erc721_def = get_oz_lib_def(
        'token/erc721/ERC721_Mintable_Burnable.cairo')

    return account_def, erc20_def, erc721_def, erc721Option_def


RECIPIENT = 123
INIT_SUPPLY = to_uint(10000000)
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
            erc20.contract_address           # owner
        ]
    )

    return (
        starknet.state,
        account1,
        account2,
        erc721,
        erc20,
        erc721Option
    )


@pytest.fixture(scope='module')
def erc721_factory(contract_defs, erc721_init):
    account_def, erc20_def, erc721_def, erc721Option_def = contract_defs
    state, account1, account2, erc721, erc20, erc721Option = erc721_init
    _state = state.copy()
    account1 = cached_contract(_state, account_def, account1)
    account2 = cached_contract(_state, account_def, account2)
    erc721 = cached_contract(_state, erc721_def, erc721)
    erc20 = cached_contract(_state, erc20_def, erc20)
    erc721Option = cached_contract(_state, erc721Option_def, erc721Option)

    return erc721, account1, account2, erc721, erc20, erc721Option


@pytest.fixture(scope='module')
async def erc721_minted(erc721_factory):
    erc721, account1, account2, erc721, erc20, erc721Option = erc721_factory
    # mint tokens to account
    for token in TOKENS:
        await signer.send_transaction(
            account1, erc721.contract_address, 'mint', [
                account1.contract_address, *token]
        )

    signer.send_transaction(
        account1, erc20.contract_address, 'transfer', [
            account2.contract_address,
            *add_uint(40000, UINT_ONE)
        ])
    return erc721, account1, account2, erc721, erc20, erc721Option

# struct ERC721PUT:
#     member strike_price : Uint256
#     member expiry_date : felt
#     member erc721_address : felt
#     member erc721_id : Uint256
#     member premium : Uint256
#     member buyer_address : felt
#     member seller_address : felt
# end

EXPIRY_DATE = 5436543875684343534
BID = to_uint(10000)
PREMIUM = to_uint(5000)
NULL_BUYERS_ADDRESS = to_uint(0)
NULL_SELLERS_ADDRESS = to_uint(0)


@pytest.fixture(scope="module")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


@pytest.mark.asyncio
async def test_open_bid(erc721_minted):
    erc721, account1, account2, erc721, erc20, erc721Option = erc721_minted
    signer.send_transaction(
        account1, erc721Option.contract_address, 'register_put_bid', [
            BID,
            *EXPIRY_DATE,
            erc721.contract_address,
            *(TOKENS[0]),
            *PREMIUM,
            *NULL_BUYERS_ADDRESS,
            *NULL_BUYERS_ADDRESS
        ])

    execution_info1 = await erc721Option.view_bid_count().call()
    assert execution_info1.result.count == 1

    # await assert_revert(signer.send_transaction(
    #     account, erc20.contract_address, 'transfer', [
    #         RECIPIENT,
    #         *add_uint(INIT_SUPPLY, UINT_ONE)
    #     ]),
    #     reverted_with="ERC20: transfer amount exceeds balance"
    # )


# #
# # supportsInterface
# #


# @pytest.mark.asyncio
# async def test_supportsInterface(erc721_factory):
#     erc721, _, _ = erc721_factory

#     execution_info = await erc721.supportsInterface(ENUMERABLE_INTERFACE_ID).invoke()
#     assert execution_info.result == (TRUE,)

# #
# # totalSupply
# #


# @pytest.mark.asyncio
# async def test_totalSupply(erc721_minted):
#     erc721, _, _ = erc721_minted

#     execution_info = await erc721.totalSupply().invoke()
#     assert execution_info.result == (TOTAL_TOKENS,)


# #
# # tokenOfOwnerByIndex
# #


# @pytest.mark.asyncio
# async def test_tokenOfOwnerByIndex(erc721_minted):
#     erc721, account, _ = erc721_minted

#     # check index
#     for i in range(0, len(TOKENS)):
#         execution_info = await erc721.tokenOfOwnerByIndex(
#             account.contract_address, to_uint(i)).invoke()
#         assert execution_info.result == (TOKENS[i],)


# @pytest.mark.asyncio
# async def test_tokenOfOwnerByIndex_greater_than_supply(erc721_minted):
#     erc721, account, _ = erc721_minted

#     tokens_plus_one = add_uint(TOTAL_TOKENS, to_uint(1))

#     await assert_revert(
#         erc721.tokenOfOwnerByIndex(
#             account.contract_address, tokens_plus_one).invoke(),
#         reverted_with="ERC721_Enumerable: owner index out of bounds"
#     )


# @pytest.mark.asyncio
# async def test_tokenOfOwnerByIndex_owner_with_no_tokens(erc721_minted):
#     erc721, _, _ = erc721_minted

#     await assert_revert(
#         erc721.tokenOfOwnerByIndex(RECIPIENT, to_uint(1)).invoke(),
#         reverted_with="ERC721_Enumerable: owner index out of bounds"
#     )


# @pytest.mark.asyncio
# async def test_tokenOfOwnerByIndex_transfer_all_tokens(erc721_minted):
#     erc721, account, other = erc721_minted

#     # transfer all tokens
#     for token in TOKENS:
#         await signer.send_transaction(
#             account, erc721.contract_address, 'transferFrom', [
#                 account.contract_address,
#                 other.contract_address,
#                 *token
#             ]
#         )

#     execution_info = await erc721.balanceOf(other.contract_address).invoke()
#     assert execution_info.result == (TOTAL_TOKENS,)

#     for i in range(0, len(TOKENS)):
#         execution_info = await erc721.tokenOfOwnerByIndex(other.contract_address, to_uint(i)).invoke()
#         assert execution_info.result == (TOKENS[i],)

#     execution_info = await erc721.balanceOf(account.contract_address).invoke()
#     assert execution_info.result == (to_uint(0),)

#     # check that queries to old owner's token ownership reverts since index is less
#     # than the target's balance
#     await assert_revert(erc721.tokenOfOwnerByIndex(
#         account.contract_address, to_uint(0)).invoke(),
#         reverted_with="ERC721_Enumerable: owner index out of bounds"
#     )


# @pytest.mark.asyncio
# async def test_tokenOfOwnerByIndex_safe_transfer_all_tokens(erc721_minted):
#     erc721, account, other = erc721_minted

#     # safe transfer all tokens
#     for token in TOKENS:
#         await signer.send_transaction(
#             account, erc721.contract_address, 'safeTransferFrom', [
#                 account.contract_address,
#                 other.contract_address,
#                 *token,
#                 len(DATA),
#                 *DATA
#             ]
#         )

#     execution_info = await erc721.balanceOf(other.contract_address).invoke()
#     assert execution_info.result == (TOTAL_TOKENS,)

#     for i in range(0, len(TOKENS)):
#         execution_info = await erc721.tokenOfOwnerByIndex(other.contract_address, to_uint(i)).invoke()
#         assert execution_info.result == (TOKENS[i],)

#     execution_info = await erc721.balanceOf(account.contract_address).invoke()
#     assert execution_info.result == (to_uint(0),)

#     # check that queries to old owner's token ownership reverts since index is less
#     # than the target's balance
#     await assert_revert(erc721.tokenOfOwnerByIndex(
#         account.contract_address, to_uint(0)).invoke(),
#         reverted_with="ERC721_Enumerable: owner index out of bounds"
#     )


# #
# # tokenByIndex
# #


# @pytest.mark.asyncio
# async def test_tokenByIndex(erc721_minted):
#     erc721, _, _ = erc721_minted

#     for i in range(0, len(TOKENS)):
#         execution_info = await erc721.tokenByIndex(to_uint(i)).invoke()
#         assert execution_info.result == (TOKENS[i],)


# @pytest.mark.asyncio
# async def test_tokenByIndex_greater_than_supply(erc721_minted):
#     erc721, _, _ = erc721_minted

#     await assert_revert(
#         erc721.tokenByIndex(to_uint(5)).invoke(),
#         reverted_with="ERC721_Enumerable: global index out of bounds"
#     )


# @pytest.mark.asyncio
# async def test_tokenByIndex_burn_last_token(erc721_minted):
#     erc721, account, _ = erc721_minted

#     tokens_minus_one = sub_uint(TOTAL_TOKENS, to_uint(1))

#     # burn last token
#     await signer.send_transaction(
#         account, erc721.contract_address, 'burn', [
#             *TOKENS[4]]
#     )

#     execution_info = await erc721.totalSupply().invoke()
#     assert execution_info.result == (tokens_minus_one,)

#     for i in range(0, 4):
#         execution_info = await erc721.tokenByIndex(to_uint(i)).invoke()
#         assert execution_info.result == (TOKENS[i],)

#     await assert_revert(
#         erc721.tokenByIndex(tokens_minus_one).invoke(),
#         reverted_with="ERC721_Enumerable: global index out of bounds"
#     )


# @pytest.mark.asyncio
# async def test_tokenByIndex_burn_first_token(erc721_minted):
#     erc721, account, _ = erc721_minted

#     # burn first token
#     await signer.send_transaction(
#         account, erc721.contract_address, 'burn', [
#             *TOKENS[0]]
#     )

#     # TOKEN[0] should be burnt and TOKEN[4] should be swapped
#     # to TOKEN[0]'s index
#     new_token_order = [TOKENS[4], TOKENS[1], TOKENS[2], TOKENS[3]]
#     for i in range(0, 3):
#         execution_info = await erc721.tokenByIndex(to_uint(i)).invoke()
#         assert execution_info.result == (new_token_order[i],)


# @pytest.mark.asyncio
# async def test_tokenByIndex_burn_and_mint(erc721_minted):
#     erc721, account, _ = erc721_minted

#     for token in TOKENS:
#         await signer.send_transaction(
#             account, erc721.contract_address, 'burn', [
#                 *token]
#         )

#     execution_info = await erc721.totalSupply().invoke()
#     assert execution_info.result == (to_uint(0),)

#     await assert_revert(
#         erc721.tokenByIndex(to_uint(0)).invoke(),
#         reverted_with="ERC721_Enumerable: global index out of bounds"
#     )

#     # mint new tokens
#     for token in TOKENS:
#         await signer.send_transaction(
#             account, erc721.contract_address, 'mint', [
#                 account.contract_address, *token]
#         )

#     for i in range(0, len(TOKENS)):
#         execution_info = await erc721.tokenByIndex(to_uint(i)).invoke()
#         assert execution_info.result == (TOKENS[i],)
