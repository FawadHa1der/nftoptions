import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { PutOptionFormType } from "components/wallet/PutOptionForm";
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

    const [openPuts, setOpenPuts] = useState<PutData[]>([]);
    const [openPutPhotos, setOpenPutPhotos] = useState<NFTData[]>([]);

    const [yourOpenPuts, setYourOpenPuts] = useState<PutData[]>([]);
    const [yourOpenPutsPhotos, setYourOpenPutsPhotos] = useState<NFTData[]>([]);

    const [yourActivePuts, setYourActivePuts] = useState<PutData[]>([]);
    const [yourActivePutsPhotos, setYourActivePutsPhotos] = useState<NFTData[]>([]);

    const [closedPuts, setClosedPuts] = useState<PutData[]>([]);
    const [closedPutsPhotos, setClosedPutsPhotos] = useState<NFTData[]>([]);

    let all_bids: PutData[] = []

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

            console.log('view_bids_count ' + view_bids_count[0])
            // let open_bids: Array<PutData> = []
            // let closed_bids: Array<PutData> = []
            // let your_open_bids: Array<PutData> = []
            // let your_active_bids: Array<PutData> = []

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

            let tempOpenPuts = all_bids.filter(obj => {
                let myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)
                if (obj.status == PutStatus.OPEN && obj.buyer_address.toString() !== myAddress.toString()) {
                    return true
                }
                return false
            })
            setOpenPuts(tempOpenPuts)
            setOpenPutPhotos(await assembleIndividualNFTs(tempOpenPuts))

            let tempYourOpenPuts = all_bids.filter(obj => {
                let myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)
                if (obj.status == PutStatus.OPEN && obj.buyer_address.toString() === myAddress.toString()) {
                    return true
                }
                return false
            })
            setYourOpenPuts(tempYourOpenPuts)
            setYourOpenPutsPhotos(await assembleIndividualNFTs(tempYourOpenPuts))

            let tempYourActivePuts = all_bids.filter(obj => {
                let myAddress = new BN(getStarknet().account.address.replace(/^0x/, ''), 16)
                if (obj.status == PutStatus.ACTIVE && (obj.buyer_address.toString() === myAddress.toString() || (obj.seller_address.toString() === myAddress.toString()))) {
                    return true
                }
                return false
            })
            setYourActivePuts(tempYourActivePuts)
            setYourActivePutsPhotos(await assembleIndividualNFTs(tempYourActivePuts))

            let tempClosedPuts = all_bids.filter(obj => (obj.status == PutStatus.CLOSED))
            setClosedPuts(closedPuts)
            setClosedPutsPhotos(await assembleIndividualNFTs(closedPuts))
        }
        async function assembleIndividualNFTs(puts: PutData[]) {
            let photos: NFTData[] = []
            for (const put of puts) {
                await fetch("https://api-testnet.playoasisx.com/asset?contract_address=" + put.erc721_address.toString(16) + "&token_id=" + put.erc721_id)
                    .then(res => res.json())
                    .then((obj) => {
                        photos.push(obj)
                    })
            }
            return photos
        }

        const enable = async () => {
            const [userWalletContractAddress] = await getStarknet().enable()
            if (getStarknet().isConnected === false) {
                // throw Error("starknet wallet not connected")
            }
            else {
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
        <div style={{ paddingTop: "1.5vh" }}>
            <Head>
                <title>Select an image to purchase a put option</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box overflow="hidden" minH="75vh" rounded="10px" style={{ border: "1px black solid", borderRadius: "50px" }}>
                <Container>
                    <Text
                        fontWeight="semibold"
                        mb="1rem"
                        textAlign="center"
                        fontSize={["4xl", "4xl", "5xl", "5xl"]}
                    >
                        Select an image to buy a put option
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

                <Tabs align="center" variant={"line"}>
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
                                        <Link href={{ pathname: `/photos`, query: { nft: JSON.stringify(pic), putData: null, formType: json.stringify(PutOptionFormType.CREATE) } }}>
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
                            <Wrap px="1rem" spacing={4} justify="center">
                                {yourOpenPutsPhotos.map((pic) => (
                                    <WrapItem
                                        key={pic.token_id}
                                        boxShadow="base"
                                        rounded="20px"
                                        overflow="hidden"
                                        bg="white"
                                        lineHeight="0"
                                        _hover={{ boxShadow: "dark-lg" }}
                                    >
                                        <Link href={{ pathname: `/photos`, query: { nft: JSON.stringify(pic), putData: JSON.stringify(yourOpenPuts[yourOpenPutsPhotos.indexOf(pic)]), formType: json.stringify(PutOptionFormType.YOUR_OPEN_BID) } }}>
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
                            <Wrap px="1rem" spacing={4} justify="center">
                                {openPutPhotos.map((pic) => (
                                    <WrapItem
                                        key={pic.token_id}
                                        boxShadow="base"
                                        rounded="20px"
                                        overflow="hidden"
                                        bg="white"
                                        lineHeight="0"
                                        _hover={{ boxShadow: "dark-lg" }}
                                    >
                                        <Link href={{ pathname: `/photos`, query: { nft: json.stringify(pic), putData: json.stringify(openPuts[openPutPhotos.indexOf(pic)]), formType: json.stringify(PutOptionFormType.OPEN_BIDS) } }}>
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
                            <Wrap px="1rem" spacing={4} justify="center">
                                {yourActivePutsPhotos.map((pic) => (
                                    <WrapItem
                                        key={pic.token_id}
                                        boxShadow="base"
                                        rounded="20px"
                                        overflow="hidden"
                                        bg="white"
                                        lineHeight="0"
                                        _hover={{ boxShadow: "dark-lg" }}
                                    >
                                        <Link href={{ pathname: `/photos`, query: { nft: JSON.stringify(pic), putData: JSON.stringify(yourActivePuts[yourActivePutsPhotos.indexOf(pic)]), formType: json.stringify(PutOptionFormType.ACTIVE_BIDS) } }}>
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
                            <Wrap px="1rem" spacing={4} justify="center">
                                {closedPutsPhotos.map((pic) => (
                                    <WrapItem
                                        key={pic.token_id}
                                        boxShadow="base"
                                        rounded="20px"
                                        overflow="hidden"
                                        bg="white"
                                        lineHeight="0"
                                        _hover={{ boxShadow: "dark-lg" }}
                                    >
                                        <Link href={{ pathname: `/photos`, query: { nft: JSON.stringify(pic), putData: JSON.stringify(closedPuts[closedPutsPhotos.indexOf(pic)]), formType: json.stringify(PutOptionFormType.CLOSED_BIDS) } }}>
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
                    </TabPanels>
                </Tabs>
                <Flex my="1rem" justify="center" align="center" direction="column">
                    <a target="_blank" href="https://testnet.aspect.co/">
                    </a>
                    <a
                        href="https://testnet.aspect.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Head over to testnet.aspect.co to get some NFTs first
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
