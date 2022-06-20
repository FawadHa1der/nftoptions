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
import { NFTData } from "./NFTData";
import { getStarknet } from "get-starknet";

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

import ricksdbcompiledcontract from "../../compiledcairo/ricksdb.json";
import * as ricksompiledcontract from "../../compiledcairo/RICKS.json";
import erc721compiledcontract from "../../compiledcairo/erc721.json";

//const ricksDBAddress = '0x079880178fd906895816195f820a31bb1842570cbfe5e19ce15275bcb0dde9fe';
const ricksDBAddress = '0x03a1ad875dd9e9cbacb3a02ba6b7d3089bf9181c3f0a5da5753963828f416e59';


const Gallery = () => {

    const [photos, setPhotos] = useState<NFTData[]>();
    const toast = useToast();
    // const [nfts, setNFTS] = useState();

    useEffect(() => {
        async function getNFTS(user: string) {
            fetch("https://api-testnet.playoasisx.com/assets?owner_address=" + user)
                .then(res => res.json())
                .then(setPhotos)
            console.log(photos);
            // return () => {
            //     setQuery({}); // This worked for me
            //     setPhotos();
            // };
        }

        async function getAllRicks() {
            const ricksDB = new Contract((ricksdbcompiledcontract as CompiledContract).abi, ricksDBAddress);
            let total_ricks = await ricksDB.call('get_total_ricks')
            let int_total_ricks = parseInt(total_ricks[0])
            console.log('total_ricks   xxx ', int_total_ricks, typeof (int_total_ricks))
            for (let i = 0; i < int_total_ricks; i++) {
                // console.log('calling')
                // let ricksdb = await ricksDB.call('get_ricks_address', [i])
                // let ricksAddress = new BigNumber(ricksdb[0])
                // console.log('for index', i, 'ricks address is ', ricksAddress.toFixed())
                // // const { data } = ricksompiledcontract
                // // /                let parseCompiledContract = json.parse(ricksompiledcontract as string);

                // const ricksContract = new Contract((ricksompiledcontract as CompiledContract).abi, ricksAddress.toFixed());
                // const tokenid = await ricksContract.call('view_token_id')
                // const bg_token_id = new BigNumber(tokenid[0])
                // console.log('tokenid is ', bg_token_id)

                // const tokenAddress = await ricksContract.call('view_token_address')
                // const bgTokenAddress = new BigNumber(tokenAddress[0])
                // console.log('tokenAddress is ', bgTokenAddress.toFixed())

                // const erc721Contract = new Contract((erc721compiledcontract as CompiledContract).abi, bgTokenAddress.toFixed());
                // const tokenUri = await erc721Contract.call('tokenURI', [bg_token_id.toFixed(), 0])
                // const bgTokenuri = new BigNumber(tokenUri[0])
                // console.log('tokenUri is ', bgTokenuri.toFixed())

            }
        }

        const enable = async () => {
            const [userWalletContractAddress] = await getStarknet().enable()
            if (getStarknet().isConnected === false) {
                // throw Error("starknet wallet not connected")
            }
            else {
                console.log('connected with ', getStarknet().account.address)
                getNFTS(getStarknet().account.address);
                getAllRicks()
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

        // if (getStarknet().isConnected === true) {

        // } else {
        //     // enableArgentX()
        // }
    }, [getStarknet().isConnected])

    return (
        <div>
            <Head>
                <title>Your NFTs, select an image to fractionalize</title>
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
                        Your NFTs, select an image to fractionalize or Bid on
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
                        <Tab>NFTs to bid on</Tab>
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
                            <p>two!</p>
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
