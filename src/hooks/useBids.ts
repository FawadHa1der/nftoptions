import { OPTIONS_CONTRACT_ADDRESS } from 'constants/contracts'
import { uint256 } from 'starknet'
import useSWR from 'swr'
import { callContract, createContract } from 'utils/blockchain/starknet'
import { BN } from 'bn.js'

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

  isActiveAndExpired(): boolean
  isOpenAndExpired(): boolean

}

export enum PutStatus {
  OPEN = 1,
  CANCELLED = 2,
  ACTIVE = 3,
  SETTLED = 4,
  EXERCISED = 5,
}

export async function fetcher(): Promise<PutData[]> {
  // would be good to generalise these to a deployement file
  const optioncontract = createContract(OPTIONS_CONTRACT_ADDRESS, optionsCompiledContract.abi)
  const all_bids = await callContract(optioncontract, 'view_all_bids')
  // console.log('UN MAPPED all data  ---> ' + JSON.stringify(all_bids))
  const mapped_all_bids: PutData[] = []
  if (all_bids.length > 0) {
    mapped_all_bids.push(...all_bids[0].map((option: any) => {
      const data: PutData = {
        strike_price: uint256.uint256ToBN(option.params.strike_price).divRound(new BN(10).pow(new BN(18))).toString(10),
        expiry_date: option.params.expiry_date.toString(10),
        erc721_address: option.params.erc721_address.toString(16),
        erc721_id: uint256.uint256ToBN(option.params.erc721_id).toString(10),
        premium: uint256.uint256ToBN(option.params.premium).divRound(new BN(10).pow(new BN(18))).toString(10),
        buyer_address: option.buyer_address.toString(16),
        seller_address: option.seller_address.toString(16),
        status: option.status.toNumber(),
        bid_id: option.bid_id.toString(10),
        isActiveAndExpired() {
          return (this.status == PutStatus.ACTIVE && (parseInt(this.expiry_date) + 86400) < ((Math.floor(Date.now() / 1000))))
        },
        isOpenAndExpired() {
          return (this.status == PutStatus.OPEN && parseInt(this.expiry_date) < ((Math.floor(Date.now() / 1000))))
        }
      }
      console.log(data)
      return data
    }))

    //    console.log('mapped all data  ---> ' + JSON.stringify(mapped_all_bids))
  }
  return mapped_all_bids
}

const EMPTY: PutData[] = []

export default function useBids(): PutData[] {
  const { data } = useSWR('Bids', fetcher)
  return data ?? EMPTY
}
