import { BN } from 'bn.js'
import { getStarknet } from 'get-starknet'
import { uint256 } from 'starknet'
import { callContract, createContract } from 'utils/blockchain/starknet'

import optionsCompiledContract from '../compiledcairo/erc721_option.json'
import { PutData, PutStatus } from './useBids'
import { fetcher, NFTData } from './useMyNFTs'

const optionsContractAddress = '0x048a64f708011fb5089778204f37d6111bd9bbac0fe4b6e7851292b8cbeeb6ef'

const bidsCache: PutData[] = []

export async function getAllBidsTest(): Promise<PutData[]> {
  // would be good to generalise these to a deployement file
  console.log('!'.repeat(100))
  const optioncontract = createContract(optionsContractAddress, optionsCompiledContract.abi)
  const all_bids = await callContract(optioncontract, 'view_all_bids')
  console.log('UN MAPPED all data  ---> ' + JSON.stringify(all_bids))
  const mapped_all_bids: PutData[] = []
  if (all_bids.length > 0) {

    mapped_all_bids.push(...all_bids[0].map((option: any) => {
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
        isExpiredButNotSettled() {
          return (this.status == PutStatus.ACTIVE && parseInt(this.expiry_date) < ((new Date()).getUTCSeconds() + 86400))
        },
        isExpiredButOpen() {
          return (this.status == PutStatus.OPEN && parseInt(this.expiry_date) < ((new Date()).getUTCSeconds() + 86400))
        }

      }
      console.log(data)
      return data
    }))
  }


  bidsCache.push(...mapped_all_bids)
  console.log('mapped all data  ---> ' + JSON.stringify(mapped_all_bids))
  return mapped_all_bids
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
