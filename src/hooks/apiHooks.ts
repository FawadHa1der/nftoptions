import { NFTData } from "components/wallet/NFTData";


export function getNfts(user: string): Promise<NFTData[]> {
  return fetch("https://api-testnet.aspect.co/api/v0/assets?owner_address=" + user)
  .then(res => res.json())
  .then(data => {
      /* process your data further */
      return data.assets;
  })
}