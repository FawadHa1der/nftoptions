import { BigNumber } from 'ethers'

import formatTruncatedNumber from './formatTruncatedNumber'
import fromWei from './fromWei'

export default function formatTruncatedUSD(price: number | BigNumber) {
  const signStr = price < 0 ? '-' : ''
  const val = BigNumber.isBigNumber(price) ? fromWei(price) : price
  const absVal = Math.abs(val)
  const numStr = absVal < 1000 ? formatTruncatedNumber(absVal, 2) : formatTruncatedNumber(absVal)
  return signStr + '$' + numStr
}
