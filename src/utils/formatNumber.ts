import { BigNumber } from 'ethers'

import fromWei from './fromWei'

// default to 0.1% precision
const DEFAULT_PRECISION = 0.001

const round = (val: number, dps: number) => {
  const mul = Math.pow(10, dps)
  return Math.round(val * mul) / mul
}

export default function formatNumber(
  value: number | BigNumber,
  minDps = 2,
  maxDps = 6,
  precision = DEFAULT_PRECISION
): string {
  // resolve value as number
  let val = 0
  if (BigNumber.isBigNumber(value)) {
    val = fromWei(value)
  } else {
    val = value
  }

  if (isNaN(val)) {
    return 'NaN'
  }

  let numDps = minDps
  let currRoundedVal: number = round(val, numDps)
  for (; numDps <= maxDps; numDps++) {
    currRoundedVal = round(val, numDps)
    const currPrecision = Math.abs((val - currRoundedVal) / val)
    if (currPrecision <= precision) {
      // escape dp increment when we hit desired precision
      break
    }
  }
  const roundedVal = currRoundedVal

  if (roundedVal === 0) {
    // always render at least one .0
    return '0.' + ''.padEnd(Math.max(1, minDps), '0')
  }

  // convert into styled string
  // commas for number part e.g. 1,000,000
  // padded zeroes for dp precision e.g. 0.1000
  const parts = roundedVal.toString().split('.')
  const num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') // add commas
  const dec = (parts[1] || '').padEnd(minDps, '0')
  return dec != null && dec.length > 0 ? num + '.' + dec : num
}
