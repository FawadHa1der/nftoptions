import { PutOptionForm } from "components/wallet";
import { NFTData } from "components/wallet/NFTData";
import { useState } from "react";
import { IPutOption } from "components/wallet/PutOptionForm";
import React, { useEffect } from "react";

import {
  Box,
  Divider,
  Center,
  Text,
  Flex,
  Spacer,
  Button,
} from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'
import { utils } from "ethers"

import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { InfoIcon, AtSignIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import fs from 'fs';
import path from 'path';
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
import { sendTransaction } from "utils/blockchain/starknet";

// import ricksompiledcontract from "../compiledcairo/RICKS.json";
// import stakingpoolcompiledcontract from "../compiledcairo/StakingPool.json";
// import erc20compiledcontract from "../compiledcairo/erc20.json";
// import erc721compiledcontract from "../compiledcairo/erc721.json";

export async function getStaticProps() {
  const compiledDirectory = path.join(process.cwd(), 'src/compiledcairo');
  const fullStakingPath = path.join(compiledDirectory, "StakingPool.json");

  const fullRicksPath = path.join(compiledDirectory, "ricks.json");
  const fullOptionsPath = path.join(compiledDirectory, "erc721_option.json");

  const fullDBPath = path.join(compiledDirectory, "ricksdb.json");
  const erc721Path = path.join(compiledDirectory, "erc721.json");
  const erc20Path = path.join(compiledDirectory, "erc20.json");

  //  JSON.parse(JSON.stringify(request.results)); 

  return {
    props: {
      stakingpool: fs.readFileSync(fullStakingPath).toString("ascii"),
      ricks: fs.readFileSync(fullRicksPath).toString("ascii"),
      erc721: fs.readFileSync(erc721Path).toString("ascii"),
      erc20: fs.readFileSync(erc20Path).toString("ascii"),
      ricksDB: fs.readFileSync(fullDBPath).toString("ascii"),
      nftOptions: fs.readFileSync(fullOptionsPath).toString("ascii")
    }
  };
}

// import { transformCallsToMulticallArrays } from "starknet/utils/transaction";

interface PhotoProps {
  stakingpool: any;
  ricks: any;
  erc721: any;
  erc20: any;
  ricksDB: any;
  nftOptions: any;
}

function getUint256CalldataFromBN(bn: number.BigNumberish) {
  return { type: "struct" as const, ...uint256.bnToUint256(bn) }
}

function parseInputAmountToUint256(input: string, decimals = 18) {
  return getUint256CalldataFromBN(utils.parseUnits(input, decimals).toString())
}


export default function Photos(props: PhotoProps) {
  const optionsAddress = '0x03fe6c71c40715a542cae5f2fb65381753f089f63f4d5dbc3df5239b93dfb07a';

  const router = useRouter();
  const [data, setData] = useState<IPutOption>();
  const [pic, setPic] = useState<NFTData>();

  const [stkAddress, setStkAddress] = useState<string>();
  const [ricksAddress, setRicksAddress] = useState<string>();

  useEffect(() => {
    if (!!router.query.data)
      setPic(JSON.parse(router.query.data as string) as NFTData);
    console.log("pic  ", pic);
  }, [router.query]);

  const toast = useToast();

  async function onRegistered(optionData: IPutOption) {

    setData(optionData);
    console.log('fractionData  ', optionData)
    toast({ description: 'This might take 3-10 mins deploying to goerli test net' })

    /*struct ERC721PUT:
        member strike_price : Uint256
        member expiry_date : felt
        member erc721_address : felt
        member erc721_id : Uint256
        member premium : Uint256
        member buyer_address : felt
        member seller_address : felt
    end
    10 fields in the transaction
     */

    const low_strike_price = optionData.strike_price
    const high_strike_price = '0'
    const expiry_date = '7598437954379574398'
    const erc721_address = pic?.contract_address
    const erc721_id_low = pic?.token_id
    const erc721_id_high = '0'
    const premium_low = optionData.premium
    const premium_high = '0'
    // const buyer_address = ''
    const myStruct = { a: low_strike_price, b: high_strike_price, c: expiry_date, d: erc721_address, e: erc721_id_low, f: erc721_id_high, g: premium_low, h: premium_high, i: '0', j: '0' }

    const nftOptions = new Contract(json.parse(props.nftOptions).abi, optionsAddress);
    let transaction_response = await sendTransaction(nftOptions, 'register_put_bid', myStruct)
  }

  return (
    <Box p="2rem" bg="gray.200" minH="100vh">
      <Head>
        <title> Image: {pic?.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex px="1rem" justify="center" align="center">
        <Text
          letterSpacing="wide"
          textDecoration="underline"
          as="h2"
          fontWeight="semibold"
          fontSize="xl"
        >
          <AtSignIcon />
          {pic?.description}
        </Text>
        <Spacer />
        <Box as="a" target="_blank" href={pic?.copy_image_url}>
          <InfoIcon focusable="true" boxSize="2rem" color="red.500" />{" "}
        </Box>{" "}
        <Spacer />
        <Link href="/" >
          <Button
            as="a"
            borderRadius="full"
            colorScheme="pink"
            fontSize="lg"
            size="lg"
            cursor="pointer"
          >
            🏠 Home
          </Button>
        </Link>
      </Flex>
      <Divider my="1rem" />

      <Center>
        <Box as="a" target="_blank" href={pic?.copy_image_url}>
          <Image
            src={(!!pic) ? (!!pic.copy_image_url) ? pic.copy_image_url : '/vercel.svg' : '/vercel.svg'}
            width={300}
            height={300}
            loading="eager"
          />
        </Box>
      </Center>

      <PutOptionForm onRegistered={onRegistered} nftdata={pic} />
    </Box >
  );
}

