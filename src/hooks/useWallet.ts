import { getStarknet } from 'get-starknet'
import useSWR from 'swr'

export async function fetcher(): Promise<string> {
  const [userWalletContractAddress] = await getStarknet().enable()
  return userWalletContractAddress
}

export default function useWallet(): string | null {
  const { data } = useSWR('Wallet', fetcher)
  return data ?? null
}
