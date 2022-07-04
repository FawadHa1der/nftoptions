import { BigNumber } from 'ethers'

import formatNumber from './formatNumber'
import fromWei from './fromWei'

const BILLION = Math.pow(10, 9)
const MILLION = Math.pow(10, 6)
const THOUSAND = Math.pow(10, 3)

export default function formatTruncatedNumber(value: BigNumber | number, minDps = 1, maxDps = 2) {
  let val = 0
  if (BigNumber.isBigNumber(value)) {
    val = fromWei(value)
  } else {
    val = value
  }
  // TODO: add trillion case... one day 8)
  if (Math.abs(val) >= BILLION) {
    // billion
    return formatNumber(val / BILLION, minDps, maxDps) + 'b'
  } else if (Math.abs(val) >= MILLION) {
    // million
    return formatNumber(val / MILLION, minDps, maxDps) + 'm'
  } else if (Math.abs(val) >= THOUSAND) {
    // thousand
    return formatNumber(val / THOUSAND, minDps, maxDps) + 'k'
  } else {
    // hundreds
    return formatNumber(val, minDps, maxDps)
  }
}
