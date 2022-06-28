export interface NFTData {
    contract_address: string;
    name: string;
    description: string;
    token_id: string;
    copy_image_url: string;
    owner_address: string;
}


export interface PutData {
    token_contract_address: string;
    token_id: string;
    buyer_address: string;
    premium: string;
    strikePrice: string;
}

