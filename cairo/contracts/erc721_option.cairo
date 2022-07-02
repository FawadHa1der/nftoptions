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
from starkware.cairo.common.math_cmp import is_le
from starkware.cairo.common.uint256 import (
    Uint256,
    uint256_add,
    uint256_sub,
    uint256_le,
    uint256_lt,
    uint256_check,
    uint256_eq,
)

from openzeppelin.token.erc721.library import ERC721_approve, ERC721_transferFrom
from openzeppelin.introspection.ERC165 import ERC165_supports_interface, ERC165_register_interface
from starkware.cairo.common.bool import TRUE, FALSE
from openzeppelin.token.ERC20.interfaces.IERC20 import IERC20
from openzeppelin.token.erc721.interfaces.IERC721 import IERC721

from starkware.starknet.common.syscalls import (
    get_block_number,
    get_block_timestamp,
    get_contract_address,
    get_caller_address,
)

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
    let (success) = ERC165_supports_interface(interfaceId)
    return (success)
end

############################################################################

namespace BidState:
    const OPEN = 1
    const CANCELLED = 2
    const ACTIVE = 3
    const CLOSED = 4
end

struct ERC721PUT_PARAM:
    member strike_price : Uint256
    member expiry_date : felt
    member erc721_address : felt
    member erc721_id : Uint256
    member premium : Uint256
    # member buyer_address : felt
    # member seller_address : felt
end

struct ERC721PUT:
    member params : ERC721PUT_PARAM
    member buyer_address : felt
    member seller_address : felt
    member status : felt
    member bid_id : felt
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

# @storage_var
# func puts(put_id : felt) -> (res : ERC721PUT):
# end

# @storage_var
# func puts_count() -> (count : felt):
# end

@storage_var
func premium_token_address() -> (address : felt):
end

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    _premium_token_address : felt
):
    premium_token_address.write(_premium_token_address)
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
        params=bid,
        buyer_address=caller_address,
        seller_address=0,
        status=BidState.OPEN,
        bid_id=current_index,
    )

    # let bid_to_write : ERC721PUT = ERC721PUT(
    #     strike_price=bid.strike_price,
    #     expiry_date=bid.expiry_date,
    #     erc721_address=bid.erc721_address,
    #     erc721_id=bid.erc721_id,
    #     premium=bid.premium,
    #     buyer_address=caller_address,
    #     seller_address=0,
    # )

    bids.write(current_index, bid_to_write)
    bids_count.write(new_index)
    return (bid_id=current_index)
end

@external
func cancel_put_bid{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    bid_id_ : felt
) -> (success : felt):
    let bid : ERC721PUT = bids.read(bid_id_)
    let caller_address : felt = get_caller_address()
    let status : felt = bid.status
    let _premium_token_address : felt = premium_token_address.read()
    let option_premium : Uint256 = bid.params.premium
    let _erc721_token_id : Uint256 = bid.params.erc721_id
    let _erc721_token_address : felt = bid.params.erc721_address
    let option_contract_address : felt = get_contract_address()

    assert bid.buyer_address = caller_address

    if status == BidState.OPEN:
        let bid_to_write : ERC721PUT = ERC721PUT(
            params=bid.params,
            buyer_address=bid.buyer_address,
            seller_address=caller_address,
            status=BidState.CANCELLED,
            bid_id=bid_id_,
        )
        bids.write(bid_id_, bid_to_write)

        IERC20.transferFrom(
            contract_address=_premium_token_address,
            sender=option_contract_address,
            recipient=caller_address,
            amount=option_premium,
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
func register_put_sell{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    bid_id_ : felt
) -> (success : felt):
    let bid : ERC721PUT = bids.read(bid_id_)
    let caller_address : felt = get_caller_address()
    let option_contract_address : felt = get_contract_address()

    let _premium_token_address : felt = premium_token_address.read()
    let option_premium : Uint256 = bid.params.premium
    let strike_price : Uint256 = bid.params.strike_price

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
        params=bid.params,
        buyer_address=bid.buyer_address,
        seller_address=caller_address,
        status=BidState.ACTIVE,
        bid_id=bid_id_,
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

    assert bid.status = BidState.ACTIVE
    assert bid.bid_id = bid_id_

    let _premium_token_address : felt = premium_token_address.read()
    let option_premium : Uint256 = bid.params.premium
    let strike_price : Uint256 = bid.params.strike_price

    # transfer the premium from the contract to the seller
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
        params=bid.params,
        buyer_address=bid.buyer_address,
        seller_address=bid.seller_address,
        status=BidState.CLOSED,
        bid_id=bid_id_,
    )

    bids.write(bid_id_, bid_to_write)
    # puts.write(bid_id, bid)
    return (success=TRUE)  # true or false
end
