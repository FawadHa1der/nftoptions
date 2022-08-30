import { ERC20_CONTRACT_INSTANCE } from 'constants/contracts'
import { bn } from 'date-fns/locale'
import { uint256 } from 'starknet'
import useSWR from 'swr'
import { callContract } from 'utils/blockchain/starknet'
import { BN } from 'bn.js'
import useWallet from './useWallet'

async function fetcher(key: string, address: string): Promise<number> {
  try {
    const balanceResult = await callContract(ERC20_CONTRACT_INSTANCE, 'balanceOf', address)
    const balance = uint256.uint256ToBN(balanceResult[0])
    return balance.divRound(new BN(10).pow(new BN(18))).toNumber()
  } catch (e) {
    console.error(e)
    return 0
  }
}

const EMPTY = 0

export default function useBalance(): number {
  const address = useWallet()
  const { data } = useSWR(['Balance', address], fetcher, { refreshInterval: 150000 })
  return data ?? EMPTY
}
