import { ERC20_CONTRACT_INSTANCE } from 'constants/contracts'
import { uint256 } from 'starknet'
import useSWR from 'swr'
import { callContract } from 'utils/blockchain/starknet'

import useWallet from './useWallet'

async function fetcher(key: string, address: string): Promise<bigint> {
  try {
    const balanceResult = await callContract(ERC20_CONTRACT_INSTANCE, 'balanceOf', address)
    const balance = BigInt(uint256.uint256ToBN(balanceResult[0]).toString())
    return balance
  } catch (e) {
    console.error(e)
    return BigInt(0)
  }
}

const EMPTY = BigInt(0)

export default function useBalance(): bigint {
  const address = useWallet()
  const { data } = useSWR(['Balance', address], fetcher)
  console.log({ data })
  return data ?? EMPTY
}
