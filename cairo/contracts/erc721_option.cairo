%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin, SignatureBuiltin
from starkware.cairo.common.math import (
    assert_not_zero,
    assert_not_equal,
    assert_le,
    assert_lt,
    unsigned_div_rem,
    assert_nn,
)
from starkware.cairo.common.math_cmp import is_le, is_not_zero, is_nn
from starkware.cairo.common.uint256 import (
    Uint256,
    uint256_add,
    uint256_sub,
    uint256_le,
    uint256_lt,
    uint256_check,
    uint256_eq,
)

from openzeppelin.token.erc721.library import ERC721
from openzeppelin.introspection.IERC165 import IERC165
from openzeppelin.introspection.ERC165 import ERC165

from starkware.cairo.common.bool import TRUE, FALSE
from openzeppelin.token.ERC20.interfaces.IERC20 import IERC20
from openzeppelin.token.erc721.interfaces.IERC721 import IERC721
from starkware.cairo.lang.compiler.lib.registers import get_fp_and_pc
from openzeppelin.upgrades.library import Proxy
from contracts.storage import Storage

from starkware.starknet.common.syscalls import (
    call_contract,
    get_block_number,
    get_block_timestamp,
    get_contract_address,
    get_caller_address,
)

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.memcpy import memcpy

@view
func onERC721Received(
    operator : felt, _from : felt, tokenId : Uint256, data_len : felt, data : felt*
) -> (selector : felt):
    # ERC721_RECEIVER_ID = 0x150b7a02
    return (0x150b7a02)
end

@view
func supportsInterface{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    interfaceId : felt
) -> (success : felt):
    let (success) = ERC165.supports_interface(interfaceId)
    return (success)
end

############################################################################

namespace BidState:
    const OPEN = 1
    const CANCELLED = 2
    const ACTIVE = 3
    const SETTLED = 4
    const EXERCISED = 5
end

struct ERC721PUT_PARAM:
    member expiry_date : felt
    member erc721_address : felt
    member erc721_id : Uint256
    member premium : Uint256
    member strike_price : Uint256
end

struct ERC721PUT:
    member buyer_address : felt
    member seller_address : felt
    member status : felt
    member bid_id : felt
    member params : ERC721PUT_PARAM
end

@storage_var
func bids(bid_id : felt) -> (res : ERC721PUT):
end

@view
func view_bid{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(bid_id : felt) -> (
    bid : ERC721PUT
):
    let _bid : ERC721PUT = bids.read(bid_id)
    return (bid=_bid)
end

@storage_var
func bids_count() -> (count : felt):
end

@view
func view_bids_count{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
    bids_count : felt
):
    let _bids_count : felt = bids_count.read()
    return (bids_count=_bids_count)
end

@storage_var
func premium_token_address() -> (address : felt):
end

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}():
    # DO NOT CALL USE CONSTRUCTOR, USE INITIALIZER
    return ()
end

@external
func register_put_bid{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    bid : ERC721PUT_PARAM
) -> (bid_id : felt):
    alloc_locals
    let current_index : felt = bids_count.read()
    let new_index : felt = current_index + 1

    # transfer the premium
    let _premium_token_address : felt = premium_token_address.read()
    let _erc721_token_address : felt = bid.erc721_address
    let _erc721_token_id : Uint256 = bid.erc721_id

    let caller_address : felt = get_caller_address()
    let option_contract_address : felt = get_contract_address()
    let option_premium : Uint256 = bid.premium

    IERC20.transferFrom(
        contract_address=_premium_token_address,
        sender=caller_address,
        recipient=option_contract_address,
        amount=option_premium,
    )

    IERC721.transferFrom(
        contract_address=_erc721_token_address,
        from_=caller_address,
        to=option_contract_address,
        tokenId=_erc721_token_id,
    )

    let bid_to_write : ERC721PUT = ERC721PUT(
        buyer_address=caller_address,
        seller_address=0,
        status=BidState.OPEN,
        bid_id=current_index,
        params=bid,
    )
    # let balance : Uint256 = IERC20.balanceOf(
    #     contract_address=_premium_token_address, account=option_contract_address
    # )

    # %{ print(f' register_put_bid IERC20.balanceOf :{ids.option_contract_address}    {ids.balance.low} ') %}

    bids.write(current_index, bid_to_write)
    bids_count.write(new_index)
    return (bid_id=current_index)
end

@external
func cancel_put_bid{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    bid_id_ : felt
) -> (success : felt):
    alloc_locals
    let bid : ERC721PUT = bids.read(bid_id_)
    let caller_address : felt = get_caller_address()
    let status : felt = bid.status
    let _premium_token_address : felt = premium_token_address.read()
    let option_premium : Uint256 = bid.params.premium
    let _erc721_token_id : Uint256 = bid.params.erc721_id
    let _erc721_token_address : felt = bid.params.erc721_address
    let option_contract_address : felt = get_contract_address()

    with_attr error_message("bid needs to be active"):
        assert bid.status = BidState.OPEN
    end

    with_attr error_message("internal data needs to be consistent"):
        assert bid.bid_id = bid_id_
    end

    with_attr error_message("You can only cancel your own bids"):
        assert bid.buyer_address = caller_address
    end

    # let (local is_not_requested_by_buyer : felt) = is_not_zero(bid.buyer_address - caller_address)
    let (block_time_stamp : felt) = get_block_timestamp()
    let final_expiry_time : felt = bid.params.expiry_date + 86400  # add one day to expiry date
    let (local is_past_expiry : felt) = is_le(final_expiry_time, block_time_stamp)

    if is_past_expiry == 1:
        with_attr error_message("cant cancel past the expiry date"):
            assert 1 = 0
        end
    end

    if status == BidState.OPEN:
        let bid_to_write : ERC721PUT = ERC721PUT(
            buyer_address=bid.buyer_address,
            seller_address=0,
            status=BidState.CANCELLED,
            bid_id=bid_id_,
            params=bid.params,
        )
        bids.write(bid_id_, bid_to_write)
        # let balance : Uint256 = IERC20.balanceOf(
        #     contract_address=_premium_token_address, account=option_contract_address
        # )

        # %{ print(f'IERC20.balanceOf :{ids.option_contract_address}    {ids.balance.low} ') %}
        # %{ print(f'OptionPremium :{ids.option_contract_address}    {ids.option_premium.low} ') %}

        IERC20.transfer(
            contract_address=_premium_token_address, recipient=caller_address, amount=option_premium
        )

        IERC721.transferFrom(
            contract_address=_erc721_token_address,
            from_=option_contract_address,
            to=caller_address,
            tokenId=_erc721_token_id,
        )
        tempvar syscall_ptr = syscall_ptr
        tempvar pedersen_ptr = pedersen_ptr
        tempvar range_check_ptr = range_check_ptr
    else:
        tempvar syscall_ptr = syscall_ptr
        tempvar pedersen_ptr = pedersen_ptr
        tempvar range_check_ptr = range_check_ptr
    end
    return (success=TRUE)  # true or false
end

@external
func settle_put_bid{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    bid_id_ : felt
) -> (success : felt):
    alloc_locals
    let bid : ERC721PUT = bids.read(bid_id_)
    # let caller_address : felt = get_caller_address()
    let status : felt = bid.status
    let _premium_token_address : felt = premium_token_address.read()
    let option_premium : Uint256 = bid.params.premium
    let _erc721_token_id : Uint256 = bid.params.erc721_id
    let _erc721_token_address : felt = bid.params.erc721_address
    let option_contract_address : felt = get_contract_address()

    with_attr error_message("bid needs to be active"):
        assert bid.status = BidState.ACTIVE
    end

    with_attr error_message("internal data needs to be consistent"):
        assert bid.bid_id = bid_id_
    end

    let (block_time_stamp : felt) = get_block_timestamp()
    let final_expiry_time : felt = bid.params.expiry_date + 86400  # add one day to expiry date
    let (local is_past_expiry : felt) = is_le(final_expiry_time, block_time_stamp)

    if is_past_expiry == 0:
        with_attr error_message(
                "it has to be beyond expiry date + 24 hours to be able to settle it"):
            assert 1 = 0
        end
    end

    # seller gets back the strike price and the buyer gets back the NFT but the seller gets to keep the option premium
    if status == BidState.ACTIVE:
        let bid_to_write : ERC721PUT = ERC721PUT(
            buyer_address=bid.buyer_address,
            seller_address=bid.seller_address,
            status=BidState.SETTLED,
            bid_id=bid_id_,
            params=bid.params,
        )
        bids.write(bid_id_, bid_to_write)

        IERC20.transfer(
            contract_address=_premium_token_address,
            recipient=bid.seller_address,
            amount=bid.params.strike_price,
        )

        IERC721.transferFrom(
            contract_address=_erc721_token_address,
            from_=option_contract_address,
            to=bid.buyer_address,
            tokenId=_erc721_token_id,
        )
        tempvar syscall_ptr = syscall_ptr
        tempvar pedersen_ptr = pedersen_ptr
        tempvar range_check_ptr = range_check_ptr
    else:
        tempvar syscall_ptr = syscall_ptr
        tempvar pedersen_ptr = pedersen_ptr
        tempvar range_check_ptr = range_check_ptr
    end
    return (success=TRUE)  # true or false
end

@external
func register_put_sell{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    bid_id_ : felt
) -> (success : felt):
    let bid : ERC721PUT = bids.read(bid_id_)
    let caller_address : felt = get_caller_address()
    let option_contract_address : felt = get_contract_address()

    let _premium_token_address : felt = premium_token_address.read()
    let option_premium : Uint256 = bid.params.premium
    let strike_price : Uint256 = bid.params.strike_price

    # %{ print(f'register_put_sell bid.buyer_address:{ids.bid.buyer_address} ') %}
    let (block_time_stamp : felt) = get_block_timestamp()
    let expiry_time : felt = bid.params.expiry_date
    # %{ print(f'register_put_sell bid.params.expiry_date:{ids.bid.params.expiry_date} ') %}
    # %{ print(f'register_put_sell block_time_stamp:{ids.block_time_stamp} ') %}

    with_attr error_message("current time is past the expiry date of the option"):
        assert_le(block_time_stamp, expiry_time)
    end

    with_attr error_message("Buyer and seller cannot be the same"):
        assert_not_equal(bid.buyer_address, caller_address)
    end

    # transfer the bid into the contract
    IERC20.transferFrom(
        contract_address=_premium_token_address,
        sender=caller_address,
        recipient=option_contract_address,
        amount=strike_price,
    )

    # transfer the premium from the contract to the seller
    IERC20.transfer(
        contract_address=_premium_token_address, recipient=caller_address, amount=option_premium
    )

    let bid_to_write : ERC721PUT = ERC721PUT(
        buyer_address=bid.buyer_address,
        seller_address=caller_address,
        status=BidState.ACTIVE,
        bid_id=bid_id_,
        params=bid.params,
    )

    bids.write(bid_id_, bid_to_write)
    # puts.write(bid_id, bid)
    return (success=TRUE)  # true or false
end

@external
func exercise_put{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    bid_id_ : felt
) -> (success : felt):
    let bid : ERC721PUT = bids.read(bid_id_)
    let caller_address : felt = get_caller_address()
    let option_contract_address : felt = get_contract_address()

    with_attr error_message("bid needs to be active"):
        assert bid.status = BidState.ACTIVE
    end

    with_attr error_message("internal data needs to be consistent"):
        assert bid.bid_id = bid_id_
    end

    # %{ print(f'exercise_put bid.buyer_address:{ids.bid.buyer_address} ') %}
    # %{ print(f'exercise_put caller_address:{ids.caller_address} ') %}

    with_attr error_message("You can only exercise your own bids"):
        assert bid.buyer_address = caller_address
    end

    let (block_time_stamp : felt) = get_block_timestamp()
    let final_expiry_time : felt = bid.params.expiry_date + 86400  # add one day to expiry date
    with_attr error_message("past the expiry data you cannot exercise"):
        assert_le(block_time_stamp, final_expiry_time)
    end

    let _premium_token_address : felt = premium_token_address.read()
    let option_premium : Uint256 = bid.params.premium
    let strike_price : Uint256 = bid.params.strike_price

    # transfer the strike_price from the contract to the buyer
    IERC20.transfer(
        contract_address=_premium_token_address,
        recipient=bid.buyer_address,
        amount=bid.params.strike_price,
    )

    IERC721.transferFrom(
        contract_address=bid.params.erc721_address,
        from_=option_contract_address,
        to=bid.seller_address,
        tokenId=bid.params.erc721_id,
    )

    let bid_to_write : ERC721PUT = ERC721PUT(
        buyer_address=bid.buyer_address,
        seller_address=bid.seller_address,
        status=BidState.EXERCISED,
        bid_id=bid_id_,
        params=bid.params,
    )

    bids.write(bid_id_, bid_to_write)
    return (success=TRUE)  # true or false
end

@view
func view_bids_buyer{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    user : felt
) -> (bids_len : felt, bids : ERC721PUT*):
    alloc_locals
    let (__fp__, _) = get_fp_and_pc()

    let _bids_count : felt = bids_count.read()
    let (result : ERC721PUT*) = alloc()

    # %{ print(f'ERC721PUT.SIZE:{ids.ERC721PUT.SIZE} ') %}
    # %{ print(f'ERC721PUT.RESULT:{ids.result} ') %}
    # %{ print(f'_bids_count:{ids._bids_count} ') %}

    let (result_len) = search_data(
        bid_index=_bids_count - 1, data=user, struct_index=ERC721PUT.buyer_address, result=result
    )
    return (result_len, result)
end

@view
func view_all_bids{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
    bids_len : felt, bids : ERC721PUT*
):
    alloc_locals
    let (__fp__, _) = get_fp_and_pc()

    let _bids_count : felt = bids_count.read()
    let (result : ERC721PUT*) = alloc()

    # %{ print(f'ERC721PUT.SIZE:{ids.ERC721PUT.SIZE} ') %}
    # %{ print(f'ERC721PUT.RESULT:{ids.result} ') %}
    # %{ print(f'_bids_count:{ids._bids_count} ') %}

    let (result_len) = view_bid_recursive(bid_index=_bids_count - 1, result=result)
    return (result_len, result)
end

func view_bid_recursive{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    bid_index : felt, result : ERC721PUT*
) -> (result_len : felt):
    alloc_locals
    let (__fp__, _) = get_fp_and_pc()

    let (local _bid : ERC721PUT) = bids.read(bid_index)
    local data_size

    memcpy(result, &_bid, ERC721PUT.SIZE)
    data_size = ERC721PUT.SIZE

    if bid_index == 0:
        return (1)
    end

    let (len) = view_bid_recursive(bid_index=(bid_index - 1), result=result + data_size)
    return (len + 1)
end

@view
func view_bids_seller{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    user : felt
) -> (bids_len : felt, bids : ERC721PUT*):
    alloc_locals
    let _bids_count : felt = bids_count.read()
    let (result : ERC721PUT*) = alloc()

    # return (bids_count=_bids_count)
    let (result_len) = search_data(
        bid_index=_bids_count - 1, data=user, struct_index=ERC721PUT.seller_address, result=result
    )

    return (result_len, result)
end

func search_data{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    bid_index : felt, data : felt, struct_index : felt, result : ERC721PUT*
) -> (result_len : felt):
    alloc_locals
    let (__fp__, _) = get_fp_and_pc()

    # let (local bid_searched_field : felt*) = bids.addr(bid_index)
    let (inputs) = alloc()
    assert inputs[0] = bid_index

    let (local bid_searched_field : felt) = Storage.read(bids.addr, 1, inputs, struct_index)
    let (local bid_struct_addr : felt) = Storage.compute_addr(bids.addr, 1, inputs)

    let (local _bid : ERC721PUT) = bids.read(bid_index)
    local data_size
    local found_put

    if bid_searched_field == data:
        memcpy(result, &_bid, ERC721PUT.SIZE)
        data_size = ERC721PUT.SIZE
        found_put = 1
        tempvar syscall_ptr = syscall_ptr
        tempvar pedersen_ptr = pedersen_ptr
        tempvar range_check_ptr = range_check_ptr
    else:
        tempvar syscall_ptr = syscall_ptr
        tempvar pedersen_ptr = pedersen_ptr
        tempvar range_check_ptr = range_check_ptr
        data_size = 0
        found_put = 0
    end

    if bid_index == 0:
        return (found_put)
    end

    let (len) = search_data(
        bid_index=(bid_index - 1), data=data, struct_index=struct_index, result=result + data_size
    )
    return (len + found_put)
end

#
# Initializer
#

@external
func initializer{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    proxy_admin : felt, _premium_token_address : felt
):
    Proxy.initializer(proxy_admin)
    premium_token_address.write(_premium_token_address)
    return ()
end

#
# Upgrades
#

@external
func upgrade{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    new_implementation : felt
):
    # Proxy.assert_only_admin()
    Proxy._set_implementation_hash(new_implementation)
    return ()
end

@view
func getImplementationHash{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
    address : felt
):
    let (address) = Proxy.get_implementation_hash()
    return (address)
end
