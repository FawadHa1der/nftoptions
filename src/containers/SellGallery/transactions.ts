import { PutDataWithNFT } from 'hooks/usePuts'
import { Contract } from 'starknet'
import { sendTransaction } from 'utils/blockchain/starknet'

import optionscompiledcontract from '../../compiledcairo/erc721_option.json'

export async function sellPut(nftdata: PutDataWithNFT): Promise<any> {
  const optionsAddress = '0x02e6a26d2fcb7256934c822ad8a81ee40aed922b271495d8eb1e05d031192f52'
  const nftOptionsContractInstance = new Contract(optionscompiledcontract.abi as any, optionsAddress)

  return sendTransaction(nftOptionsContractInstance, 'register_put_sell', nftdata.bid_id)
}
