import BN from 'bn.js'
import { ERC20_CONTRACT_INSTANCE } from 'constants/contracts'
import { uint256 } from 'starknet'
import useSWR from 'swr'
import { callContract } from 'utils/blockchain/starknet'

import useWallet from './useWallet'

async function fetcher(key: string, address: string): Promise<BN> {
  try {
    const balanceResult = await callContract(ERC20_CONTRACT_INSTANCE, 'balanceOf', address)
    const balance = uint256.uint256ToBN(balanceResult[0])
    return balance
  } catch (e) {
    console.error(e)
    return new BN(0)
  }
}

const EMPTY = new BN(0)

export default function useBalance(): BN {
  const address = useWallet()
  const { data } = useSWR(['Balance', address], fetcher)
  console.log({ data })
  return data ?? EMPTY
}
