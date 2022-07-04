import { BigNumber } from 'ethers'

import formatNumber from './formatNumber'

export default function formatUSD(price: number | BigNumber, dps: number = 2): string {
  const signStr = price < 0 ? '-' : ''
  if (typeof price === 'number' && isNaN(price)) {
    return ''
  }
  const numStr = formatNumber(price, dps, dps)
  return signStr + '$' + (numStr.startsWith('-') ? numStr.slice(1) : numStr)
}
