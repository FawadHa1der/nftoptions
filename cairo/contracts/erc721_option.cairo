%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin, SignatureBuiltin
from starkware.starknet.common.syscalls import get_caller_address
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

struct ERC721PUT:
    member strike_price : Uint256
    member expiry_date : felt
    member erc721_address : felt
    member erc721_id : Uint256
    member premium : felt
end

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

@storage_var
func open_puts(i : felt) -> (res : ERC721PUT):
end

@storage_var
func open_puts_count() -> (count : felt):
end

@storage_var
func active_puts(i : felt) -> (res : ERC721PUT):
end

@storage_var
func active_puts_count() -> (count : felt):
end

@external
func register_buy_put{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    put : ERC721PUT
) -> (put_id : felt):
    return (0)  # need to update later on
end

@external
func register_sell_put{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    put_id : felt
) -> (active_id : felt):
    return (TRUE)
end
