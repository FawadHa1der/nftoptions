import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'

export default function fromBigNumber(number: BigNumber, decimals: number): number {
  return parseFloat(formatUnits(number.toString(), decimals))
}
