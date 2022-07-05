import { number, uint256 } from 'starknet'

export default function getUint256CalldataFromBN(bn: number.BigNumberish) {
  return { type: 'struct' as const, ...uint256.bnToUint256(bn) }
}
