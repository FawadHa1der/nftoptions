import { OPTIONS_CONTRACT_ADDRESS } from 'constants/contracts'
import { uint256 } from 'starknet'
import useSWR from 'swr'
import { callContract, createContract } from 'utils/blockchain/starknet'

import optionsCompiledContract from '../compiledcairo/erc721_option.json'

export interface PutData {
  strike_price: string
  expiry_date: string
  erc721_address: string
  erc721_id: string
  premium: string
  buyer_address: string
  seller_address: string
  status: number
  bid_id: string
}

export enum PutStatus {
  OPEN = 1,
  CANCELLED = 2,
  ACTIVE = 3,
  CLOSED = 4,
}

export async function fetcher(): Promise<PutData[]> {
  // would be good to generalise these to a deployement file
  const optioncontract = createContract(OPTIONS_CONTRACT_ADDRESS, optionsCompiledContract.abi)
  const view_bids_count = await callContract(optioncontract, 'view_bids_count')

  const all_bids: PutData[] = []

  for (let i = 0; i < view_bids_count[0]; i++) {
    const bid_result = await callContract(optioncontract, 'view_bid', i.toString())
    const mapped_data = bid_result.map((option: any) => {
      const data: PutData = {
        strike_price: uint256.uint256ToBN(option.params.strike_price).toString(10),
        expiry_date: option.params.expiry_date.toString(10),
        erc721_address: option.params.erc721_address.toString(16),
        erc721_id: uint256.uint256ToBN(option.params.erc721_id).toString(10),
        premium: uint256.uint256ToBN(option.params.premium).toString(10),
        buyer_address: option.buyer_address.toString(16),
        seller_address: option.seller_address.toString(16),
        status: option.status.toNumber(),
        bid_id: option.bid_id.toString(10),
      }
      return data
    })
    all_bids.push(...mapped_data)
  }
  return all_bids
}

const EMPTY: PutData[] = []

export default function useBids(): PutData[] {
  const { data } = useSWR('Bids', fetcher)
  return data ?? EMPTY
}
