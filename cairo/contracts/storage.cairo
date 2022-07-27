# copied from ---> https://github.com/Th0rgal/sphinx/blob/be04de48b5e627045a0abd6eb47cb1eba6ac29fc/src/sphinx/storage.cairo

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.registers import get_label_location
from starkware.cairo.common.invoke import invoke

from starkware.starknet.common.syscalls import storage_read, storage_write

namespace Storage:
    func write{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        storage_var : codeoffset,
        len_inputs : felt,
        inputs : felt*,
        struct_offset : felt,
        output : felt,
    ):
        let (addr) = compute_addr(storage_var, len_inputs, inputs)
        storage_write(addr + struct_offset, output)
        return ()
    end

    func read{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        storage_var : codeoffset, len_inputs : felt, inputs : felt*, struct_offset : felt
    ) -> (output : felt):
        let (addr) = compute_addr(storage_var, len_inputs, inputs)
        let (output : felt) = storage_read(addr + struct_offset)
        return (output)
    end

    # func read_length{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    #     addr : felt, output : felt*, current_index : felt, length : felt
    # ) -> ():
    #     # let (addr) = compute_addr(storage_var, len_inputs, inputs)
    #     if current_index == length:
    #         return ()
    #     end
    #     let (res : felt) = storage_read(addr + current_index)
    #     [output] = res
    #     read_length(addr, output + 1, current_index + 1, length)

    # return ()
    # end

    func compute_addr{pedersen_ptr : HashBuiltin*, range_check_ptr}(
        storage_var : codeoffset, len_inputs : felt, inputs : felt*
    ) -> (addr : felt):
        alloc_locals
        let (local func_pc) = get_label_location(storage_var)
        _prepare_call(pedersen_ptr, range_check_ptr, len_inputs, inputs + len_inputs)
        call abs func_pc  # removing alloc_locals by calling ap[11-6*2] ?
        ret
    end

    func _prepare_call(
        pedersen_ptr : HashBuiltin*, range_check_ptr, inputs_len : felt, inputs : felt*
    ) -> ():
        if inputs_len == 0:
            [ap] = pedersen_ptr; ap++
            [ap] = range_check_ptr; ap++
            return ()
        end
        _prepare_call(pedersen_ptr, range_check_ptr, inputs_len - 1, inputs - 1)
        [ap] = [inputs - 1]; ap++
        return ()
    end
end
