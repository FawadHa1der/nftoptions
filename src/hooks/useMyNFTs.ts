import useSWR, { KeyedMutator } from 'swr'

import useBids, { PutData } from './useBids'
import useWallet from './useWallet'

export interface NFTData {
  contract_address: string
  name: string
  description: string
  token_id: string
  image_url_copy: string
  owner: AssetOwner
  aspect_link: string
}

export interface AssetOwner {
  account_address: string
  quantity: string
}

type FetcherProps = {
  url: string
  bids: PutData[]
}

export async function fetcher({ url, bids }: FetcherProps): Promise<NFTData[]> {
  const tokenIdToBid: Record<string, PutData> = bids.reduce(
    (tokenIdToBidMap, bid) => ({
      ...tokenIdToBidMap,
      [bid.erc721_id]: bid,
    }),
    {}
  )
  const nfts: NFTData[] = await fetch(url)
    .then(res => res.json())
    .then(data => data.assets)
    .catch(() => [])
  // Filter out NFTs with open bids
  return nfts.filter(nft => !tokenIdToBid[nft.token_id])
}

const EMPTY: NFTData[] = []

export default function useMyNFTs(): [NFTData[], KeyedMutator<NFTData[]>] {
  const address = useWallet()
  const bids = useBids()
  const { data, mutate } = useSWR(
    address !== null ? { url: 'https://api-testnet.aspect.co/api/v0/assets?owner_address=' + address, bids } : null,
    fetcher
  )
  return [data ?? EMPTY, mutate]
}
