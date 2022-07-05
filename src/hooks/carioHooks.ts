import { BN } from 'bn.js'
import { getStarknet } from 'get-starknet'
import { uint256 } from 'starknet'
import { callContract, createContract } from 'utils/blockchain/starknet'

import optionsCompiledContract from '../compiledcairo/erc721_option.json'
import { PutData, PutStatus } from './useBids'
import { fetcher, NFTData } from './useMyNFTs'

const optionsContractAddress = '0x02e6a26d2fcb7256934c822ad8a81ee40aed922b271495d8eb1e05d031192f52'

const bidsCache: PutData[] = []

export async function getAllBidsTest(): Promise<PutData[]> {
  // would be good to generalise these to a deployement file
  console.log('!'.repeat(100))
  const optioncontract = createContract(optionsContractAddress, optionsCompiledContract.abi)
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

  bidsCache.push(...all_bids)
  console.log('all data  ---> ' + JSON.stringify(all_bids))
  return all_bids
}

export async function useMyNFTSTest(user: string): Promise<NFTData[]> {
  const nfts = await fetcher({ url: user, bids: [] })

  let localCache = bidsCache

  if (localCache.length === 0) {
    localCache = await getAllBidsTest()
    bidsCache.push(...localCache)
  }

  const validNfts: NFTData[] = []
  for (const nft of nfts) {
    let found = false
    for (const each of localCache) {
      if (each.erc721_id === nft.token_id) {
        // already has an associated bid
        found = true
      }
    }

    if (!found) {
      validNfts.push(nft)
    }
  }

  return validNfts
}

export async function useMyLongPuts(): Promise<PutData[]> {
  // get all long puts for user

  let localCache = bidsCache

  if (localCache.length === 0) {
    localCache = await getAllBidsTest()
    bidsCache.push(...localCache)
  }

  const usersLongs: PutData[] = []

  const myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)
  for (const each of localCache) {
    if (each.buyer_address === myAddress.toString(16)) {
      // already has an associated bid
      if (each.status === PutStatus.ACTIVE || each.status === PutStatus.OPEN) {
        // I am the buyer
        usersLongs.push(each)
      }
    }
  }

  return usersLongs
}

export async function useMyShortPuts(): Promise<PutData[]> {
  // get all long puts for user

  let localCache = bidsCache

  if (localCache.length === 0) {
    localCache = await getAllBidsTest()
    bidsCache.push(...localCache)
  }

  const userShorts: PutData[] = []

  const myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)
  for (const each of localCache) {
    if (each.seller_address === myAddress.toString(16)) {
      // already has an associated bid
      if (each.status === PutStatus.ACTIVE) {
        // I am the buyer
        userShorts.push(each)
      }
    }
  }

  return userShorts
}

async function getAllRelevantPuts(): Promise<PutData[]> {
  let localCache = bidsCache

  if (localCache.length === 0) {
    localCache = await getAllBidsTest()
    bidsCache.push(...localCache)
  }
  const relevantPuts: PutData[] = []
  for (const bid of localCache) {
    if (bid.status === PutStatus.ACTIVE || bid.status === PutStatus.OPEN) {
      // I am the buyer
      relevantPuts.push(bid)
    }
  }

  return relevantPuts
}
