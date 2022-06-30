import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
    Box,
    Container,
    Text,
    Wrap,
    WrapItem,
    Input,
    IconButton,
    InputRightElement,
    InputGroup,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    useToast,
    Flex,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
//import { useStarknet } from "@starknet-react/core";
import { useRouter } from "next/router";
import { NFTData, PutData, PutStatus } from "./NFTData";
import { getStarknet } from "get-starknet";
import { parseFromUint256, parseFromFelt } from "utils/parser"

import {
    Contract,
    Account,
    defaultProvider,
    ec,
    encode,
    hash,
    json,
    number,
    stark,
    shortString,
    uint256,
    Abi,
    CompiledContract
} from "starknet";
import { BigNumber } from 'bignumber.js'
import { BN } from 'bn.js'
//import * as BN from 'bn.js'

import erc721compiledcontract from "../../compiledcairo/erc721.json";
const optionsContractAddress = '0x076c00220d7c6cf0bde107c2d97ab6a6a2e590d8c36e461d10e692b6371a0a5e';
import optionsCompiledContract from "../../compiledcairo/erc721_option.json";
import { callContract, createContract } from "utils/blockchain/starknet";


const Gallery = () => {

    const [photos, setPhotos] = useState<NFTData[]>();
    const [openPut, setOpenPut] = useState<PutData[]>();
    const toast = useToast();
    // const [nfts, setNFTS] = useState();

    useEffect(() => {
        async function getNFTS(user: string) {
            fetch("https://api-testnet.playoasisx.com/assets?owner_address=" + user)
                .then(res => res.json())
                .then(setPhotos)
            console.log(photos);

            const optioncontract = createContract(optionsContractAddress, optionsCompiledContract.abi)
            const view_bids_count = await callContract(optioncontract, 'view_bids_count')
            const openBids: PutData[] = [];

            console.log('view_bids_count ' + view_bids_count[0])
            let open_bids: Array<PutData> = []
            let closed_bids: Array<PutData> = []
            let your_open_bids: Array<PutData> = []
            let your_active_bids: Array<PutData> = []
            let all_bids: Array<PutData> = []

            for (let i = 0; i < view_bids_count[0]; i++) {
                const bid_result = await callContract(optioncontract, 'view_bid', i.toString())
                const mapped_data = bid_result.map((option: any) => {
                    const data: PutData = {
                        strike_price: uint256.uint256ToBN(option.params.strike_price),
                        expiry_date: option.params.expiry_date,
                        erc721_address: option.params.erc721_address,
                        erc721_id: uint256.uint256ToBN(option.params.erc721_id),
                        premium: uint256.uint256ToBN(option.params.premium),
                        buyer_address: option.buyer_address,
                        seller_address: option.seller_address,
                        status: option.status.toNumber(),
                        bid_id: option.bid_id
                    };
                    return data
                });
                all_bids.push(...mapped_data)
            }
            console.log('all data  ---> ' + JSON.stringify(all_bids));
            open_bids = all_bids.filter(obj => {
                if (obj.status == PutStatus.OPEN) {
                    return true
                }
                return false
            })
            console.log('open bids  ---> ' + JSON.stringify(open_bids));

            your_open_bids = all_bids.filter(obj => {
                let myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)

                if (obj.status == PutStatus.OPEN && obj.buyer_address.toString() === myAddress.toString()) {
                    return true
                }
                return false
            })
            console.log('your open bids  ---> ' + JSON.stringify(your_open_bids));

            your_active_bids = all_bids.filter(obj => {
                let myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)
                if (obj.status == PutStatus.ACTIVE && (obj.buyer_address.toString() === myAddress.toString() || (obj.seller_address.toString() === myAddress.toString()))) {
                    return true
                }
                return false
            })
            console.log('your_active_bids  ---> ' + JSON.stringify(your_active_bids));
            closed_bids = all_bids.filter(obj => (obj.status == PutStatus.CLOSED))
            console.log('closed bids  ---> ' + JSON.stringify(closed_bids));
        }

        const enable = async () => {
            const [userWalletContractAddress] = await getStarknet().enable()
            if (getStarknet().isConnected === false) {
                // throw Error("starknet wallet not connected")
            }
            else {
                console.log('connected with ', getStarknet().account.address)
                getNFTS(getStarknet().account.address);
            }
        }
        enable()

        async function enableArgentX() {
            // Check if wallet extension is installed and initialized.
            const starknet = getStarknet()
            // May throw when no extension is detected, otherwise shows a modal prompting the user to download Argent X.
            const [userWalletContractAddress] = await starknet.enable()
            // checks that enable succeeded
            if (starknet.isConnected === false) {
                // throw Error("starknet wallet not connected")
            }
        }

    }, [getStarknet().isConnected])

    return (
        <div>
            <Head>
                <title>Your NFTs, select an image to a PUT option</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box overflow="hidden" bg="purple.100" minH="100vh">
                <Container>
                    <Text
                        color="pink.800"
                        fontWeight="semibold"
                        mb="1rem"
                        textAlign="center"
                        textDecoration="underline"
                        fontSize={["4xl", "4xl", "5xl", "5xl"]}
                    >
                        Your NFTs, select an image to buy a PUT option for
                    </Text>
                    {/* <form onSubmit={handleSubmit}>
                        <InputGroup pb="1rem">
                            <Input
                                placeholder="Search for Apple"
                                variant="ghost"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />

                            <InputRightElement
                                children={
                                    <IconButton
                                        aria-label="Search"
                                        icon={<SearchIcon />}
                                        bg="pink.400"
                                        color="white"
                                        onClick={handleSubmit}
                                    />
                                }
                            />
                        </InputGroup>
                    </form> */}
                </Container>

                <Tabs>
                    <TabList>
                        <Tab>Your NFTs</Tab>
                        <Tab>Your open Bids</Tab>
                        <Tab>Sell a PUT option</Tab>
                        <Tab>Active PUTS</Tab>
                        <Tab>Expired PUTS</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Wrap px="1rem" spacing={4} justify="center">
                                {photos?.map((pic) => (
                                    <WrapItem
                                        key={pic.token_id}
                                        boxShadow="base"
                                        rounded="20px"
                                        overflow="hidden"
                                        bg="white"
                                        lineHeight="0"
                                        _hover={{ boxShadow: "dark-lg" }}
                                    >
                                        <Link href={{ pathname: `/photos`, query: { data: JSON.stringify(pic) } }}>
                                            <a>
                                                <Image
                                                    src={(!!pic.copy_image_url) ? pic.copy_image_url : '/vercel.svg'}
                                                    height={200}
                                                    width={200}
                                                    alt={(!!pic.copy_image_url) ? pic.copy_image_url : '/vercel.svg'}
                                                />
                                            </a>
                                        </Link>
                                    </WrapItem>
                                ))}
                            </Wrap>
                        </TabPanel>
                        <TabPanel>
                            <p></p>
                        </TabPanel>
                        <TabPanel>
                            <p></p>
                        </TabPanel>
                        <TabPanel>
                            <p></p>
                        </TabPanel>
                        <TabPanel>
                            <p></p>
                        </TabPanel>

                    </TabPanels>
                </Tabs>
                <Flex my="1rem" justify="center" align="center" direction="column">
                    <a target="_blank" href="https://www.pexels.com">
                    </a>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Powered by
                        <Image
                            src="/vercel.svg"
                            width={283 / 4}
                            height={64 / 4}
                            alt="/vercel.svg"
                        />
                    </a>
                </Flex>
            </Box>
        </div>
    );
};

export default Gallery;


// export async function getServerSideProps() {
//     const data = await getCuratedPhotos();
//     return {
//         props: {
//             data,
//         },
//     };
// }
