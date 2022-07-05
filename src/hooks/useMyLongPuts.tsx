import BN from 'bn.js'
import { getStarknet } from 'get-starknet'
import useSWR from 'swr'

import useBids, { PutData, PutStatus } from './useBids'

async function fetcher({ bids }: { bids: PutData[] }): Promise<PutData[]> {
  const myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)
  return bids.filter(
    bid =>
      bid.seller_address === myAddress.toString(16) && (bid.status === PutStatus.ACTIVE || bid.status === PutStatus.OPEN)
  )
}

const EMPTY: PutData[] = []

export default function useMyLongPuts(): PutData[] {
  const bids = useBids()
  const { data } = useSWR({ key: 'MyLongPuts', bids }, fetcher)
  return data ?? EMPTY
}
