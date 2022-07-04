import { formatEther } from '@ethersproject/units'
import { BigNumber } from 'ethers'

export default function fromWei(number: BigNumber): number {
  return parseFloat(formatEther(number.toString()))
}
