import dateFormat from 'dateformat'
import { BigNumber } from 'ethers'

import parseDate from './parseDate'

export default function formatDateTime(ts: number | BigNumber | Date, hideYear: boolean = false): string {
  return dateFormat(parseDate(ts), `mmm dS, ${!hideYear ? 'yyyy, ' : ''}hTT`)
}
