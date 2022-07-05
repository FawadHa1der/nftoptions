import BN from 'bn.js'
import { getStarknet } from 'get-starknet'
import useSWR, { KeyedMutator } from 'swr'

import useBids, { PutData, PutStatus } from './useBids'
import { PutDataWithNFT } from './usePuts'

async function fetcher({ bids }: { bids: PutData[] }): Promise<PutDataWithNFT[]> {
  const myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)
  const myBids = bids.filter(
    bid =>
      bid.buyer_address === myAddress.toString(16) && (bid.status === PutStatus.ACTIVE || bid.status === PutStatus.OPEN)
  )
  const nfts = await Promise.all(
    myBids.map(async bid =>
      fetch('https://api-testnet.aspect.co/api/v0/asset/0x' + bid.erc721_address + '/' + bid.erc721_id).then(res =>
        res.json()
      )
    )
  )
  return myBids.map((bid, i) => ({
    ...bid,
    nftData: nfts[i],
  }))
}

const EMPTY: PutDataWithNFT[] = []

export default function useMyLongPuts(): [PutDataWithNFT[], KeyedMutator<PutDataWithNFT[]>] {
  const bids = useBids()
  const { data, mutate } = useSWR({ key: 'MyLongPuts', bids }, fetcher)
  return [data ?? EMPTY, mutate]
}
