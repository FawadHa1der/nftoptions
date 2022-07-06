import useSWR, { KeyedMutator } from 'swr'

import useBids, { PutData, PutStatus } from './useBids'
import { NFTData } from './useMyNFTs'
import useWallet from './useWallet'

export type PutDataWithNFT = PutData & {
  nftData: NFTData
}

type FetcherProps = {
  key: string
  bids: PutData[]
  address: string | null
}

async function fetcher({ bids, address }: FetcherProps): Promise<PutDataWithNFT[]> {
  const openActivePuts: PutData[] = bids.filter(
    bid => bid.status === PutStatus.OPEN && (!address || bid.buyer_address !== address.replace('0x', ''))
  )

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

export default function usePuts(): [PutDataWithNFT[], KeyedMutator<PutDataWithNFT[]>] {
  const address = useWallet()
  const bids = useBids()
  const { data, mutate } = useSWR({ key: 'Puts', bids, address }, fetcher)
  return [data ?? EMPTY, mutate]
}
