import { ERC20_CONTRACT_INSTANCE } from 'constants/contracts'
import { uint256 } from 'starknet'
import useSWR from 'swr'
import { callContract } from 'utils/blockchain/starknet'

import useWallet from './useWallet'

async function fetcher(key: string, address: string): Promise<number> {
  try {
    const balanceResult = await callContract(ERC20_CONTRACT_INSTANCE, 'balanceOf', address)
    const balance = uint256.uint256ToBN(balanceResult.balance)
    return balance.toNumber()
  } catch (e) {
    console.error(e)
    return 0
  }
}

const EMPTY = 0

export default function useBalance(): number {
  const address = useWallet()
  const { data } = useSWR(['Balance', address], fetcher)
  console.log({ data })
  return data ?? EMPTY
}
