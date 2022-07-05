import dateFormat from 'dateformat'

import parseDate from './parseDate'

export default function formatDate(ts: number, skipYear: boolean = false): string {
  return dateFormat(parseDate(ts), skipYear ? 'mmm dS' : 'mmm dS yyyy')
}
