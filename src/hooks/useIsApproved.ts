import erc721compiledcontract from 'compiledcairo/erc721.json'
import { OPTIONS_CONTRACT_ADDRESS } from 'constants/contracts'
import { Contract } from 'starknet'
import useSWR from 'swr'
import { callContract } from 'utils/blockchain/starknet'
import getUint256CalldataFromBN from 'utils/getUint256CalldataFromBN'

import useWallet from './useWallet'

async function fetcher(key: string, owner: string, contractAddress: string, tokenId: string) {
  console.log({ key, owner, contractAddress, tokenId })
  const erc721ContractInstance = new Contract((erc721compiledcontract as any).abi, contractAddress)
  const erc721_id = getUint256CalldataFromBN(tokenId)
  try {
    const approvedResult = await callContract(erc721ContractInstance, 'getApproved', erc721_id)
    const approvedAddress = approvedResult[0]
    return approvedAddress !== '0' && OPTIONS_CONTRACT_ADDRESS.includes(approvedAddress.toString(16))
  } catch {
    return false
  }
}

export default function useIsERC721Approved(contractAddress: string, tokenId: string): boolean {
  const owner = useWallet()
  const { data } = useSWR(owner ? ['IsApproved', owner, contractAddress, tokenId] : null, fetcher)
  return data ?? false
}
