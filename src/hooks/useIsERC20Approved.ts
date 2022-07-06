import { ERC20_CONTRACT_INSTANCE, OPTIONS_CONTRACT_ADDRESS } from 'constants/contracts'
import { uint256 } from 'starknet'
import useSWR, { KeyedMutator } from 'swr'
import { callContract } from 'utils/blockchain/starknet'

import useWallet from './useWallet'

async function fetcher(key: string, owner: string) {
  try {
    const allowanceUint256 = await callContract(ERC20_CONTRACT_INSTANCE, 'allowance', owner, OPTIONS_CONTRACT_ADDRESS)
    const allowance = uint256.uint256ToBN(allowanceUint256.remaining).toNumber()
    return allowance > 0
  } catch {
    return false
  }
}

export default function useIsERC20Approved(): [boolean, KeyedMutator<boolean>] {
  const owner = useWallet()
  const { data, mutate } = useSWR(owner ? ['IsERC20Approved', owner] : null, fetcher)
  return [data ?? false, mutate]
}
