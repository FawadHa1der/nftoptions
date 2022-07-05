import BN from 'bn.js'
import { getStarknet } from 'get-starknet'
import useSWR from 'swr'

import useBids, { PutData, PutStatus } from './useBids'

async function fetcher({ bids }: { bids: PutData[] }): Promise<PutData[]> {
  const myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)
  const myBids = bids.filter(
    bid =>
      bid.buyer_address === myAddress.toString(16) &&
      bid.status === PutStatus.ACTIVE
  )

  const nfts = await Promise.all(
    myBids.map(async bid =>
      fetch('https://api-testnet.aspect.co/api/v0/asset/0x' + bid.erc721_address + '/' + bid.erc721_id).then(res =>
        res.json()
      )
    )
  )

  return myBids.map((myBids, i) => ({
    ...myBids,
    nftData: nfts[i],
  }))
}

const EMPTY: PutData[] = []

export default function useMyShortPuts(): PutData[] {
  const bids = useBids()
  const { data } = useSWR({ key: 'MyShortPuts', bids }, fetcher)
  console.log('data', data);
  return data ?? EMPTY
}
