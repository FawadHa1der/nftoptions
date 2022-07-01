import * as BN from 'bn.js'

export interface NFTData {
    contract_address: string;
    name: string;
    description: string;
    token_id: string;
    copy_image_url: string;
    owner_address: string;
}


export interface PutData {
    strike_price: BN;
    expiry_date: BN;
    erc721_address: BN;
    erc721_id: BN;
    premium: BN;
    buyer_address: BN;
    seller_address: BN;
    status: number;
    bid_id: BN;
}

// namespace BidState:
// const OPEN = 1
// const CANCELLED = 2
// const ACTIVE = 3
// const CLOSED = 4
// end

export enum PutStatus {
    OPEN = 1,
    CANCELLED = 2,
    ACTIVE = 3,
    CLOSED = 4
}


/*            {
                "params":{
                   "strike_price":{
                      "low":"0a",
                      "high":"00"
                   },
                   "expiry_date":"6973130faea3ec7e",
                   "erc721_address":"04e34321e0bce0e4ff8ff0bcb3a9a030d423bca29a9d99cbcdd60edb9a2bf03a",
                   "erc721_id":{
                      "low":"01934e",
                      "high":"00"
                   },
                   "premium":{
                      "low":"01",
                      "high":"00"
                   }
                },
                "buyer_address":"01c62c52c1709acb3eb9195594e39c04323658463cfe0c641e39b99a83ba11a1",
                "seller_address":"00",
                "status":"01",
                "bid_id":"01"
             }
             */
