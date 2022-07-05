import useSWR from 'swr'

import useBids, { PutData, PutStatus } from './useBids'
import { NFTData } from './useMyNFTs'

export type PutDataWithNFT = PutData & {
  nftData: NFTData
}

type FetcherProps = {
  key: string
  bids: PutData[]
}

async function fetcher({ bids }: FetcherProps): Promise<PutDataWithNFT[]> {
  const openActivePuts: PutData[] = []
  for (const bid of bids) {
    if (bid.status === PutStatus.OPEN) {
      openActivePuts.push(bid)
    }
  }
  const nfts = await Promise.all(
    openActivePuts.map(async bid =>
      fetch('https://api-testnet.aspect.co/api/v0/asset/0x' + bid.erc721_address + '/' + bid.erc721_id).then(res =>
        res.json()
      )
    )
  )
  return openActivePuts.map((openActivePut, i) => ({
    ...openActivePut,
    nftData: nfts[i],
  }))
}

const EMPTY: PutDataWithNFT[] = []

export default function usePuts(): PutDataWithNFT[] {
  const bids = useBids()
  const { data } = useSWR({ key: 'Puts', bids }, fetcher)

  console.log({ data })
  return data ?? EMPTY
}
