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
import { callContract, createContract } from "utils/blockchain/starknet";

import erc20compiledcontract from "../compiledcairo/erc20.json";
import erc721compiledcontract from "../compiledcairo/erc721.json";
import optionscompiledcontract from "../compiledcairo/erc721_option.json";
import { transformCallsToMulticallArrays } from "starknet/utils/transaction";

function getUint256CalldataFromBN(bn: number.BigNumberish) {
  return { type: "struct" as const, ...uint256.bnToUint256(bn) }
}

function parseInputAmountToUint256(input: string, decimals = 18) {
  return getUint256CalldataFromBN(utils.parseUnits(input, decimals).toString())
}

export default function Photos() {


  const optionsAddress = '0x076c00220d7c6cf0bde107c2d97ab6a6a2e590d8c36e461d10e692b6371a0a5e';
  const erc20Address = '0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10'; // argentx test token

  const toast = useToast();
  const router = useRouter();
  const [data, setData] = useState<IPutOption>();
  const [pic, setPic] = useState<NFTData>();

  useEffect(() => {
    if (!!router.query.data)
      setPic(JSON.parse(router.query.data as string) as NFTData);
    console.log("pic  ", pic);
  }, [router.query]);


  async function onRegistered(optionData: IPutOption) {

    setData(optionData);
    console.log('fractionData  ', optionData)
    toast({ description: 'This might take a bit' })

    /*struct ERC721PUT:
        member strike_price : Uint256
        member expiry_date : felt
        member erc721_address : felt
        member erc721_id : Uint256
        member premium : Uint256
    end
    8 fields in the transaction
     */

    const low_strike_price = optionData.strike_price
    const high_strike_price = '0'
    const expiry_date = '7598437954379574398'
    const erc721_address = pic?.contract_address ? pic?.contract_address : ''
    const erc721_id_low = pic?.token_id ? pic?.token_id : ''
    const erc721_id_high = '0'
    const premium_low = optionData.premium
    const premium_high = '0'
    // const buyer_address = ''
    const myStruct = { a: low_strike_price, b: high_strike_price, c: expiry_date, d: erc721_address, e: erc721_id_low, f: erc721_id_high, g: premium_low, h: premium_high }

    const nftOptionsContractInstance = new Contract(optionscompiledcontract.abi as any, optionsAddress);
    const erc20ContractInstance = new Contract(erc20compiledcontract.abi as any, erc20Address);
    const erc721ContractInstance = new Contract(erc721compiledcontract.abi as any, erc721_address);

    // const nftOptionsContractInstance = new Contract(json.parse(props.nftOptions).abi, optionsAddress);
    // const erc20ContractInstance = new Contract(json.parse(props.erc20).abi, erc20Address);
    // const erc721ContractInstance = new Contract(json.parse(props.erc721).abi, erc721_address);

    let transaction_response = await sendTransaction(erc721ContractInstance, 'approve', { to: optionsAddress, tokenIdLow: erc721_id_low, tokenIdHigh: 0 })
    console.log(`Waiting for erc721 approve Tx ${transaction_response.transaction_hash} to be Accepted `);
    await getStarknet().provider.waitForTransaction(transaction_response.transaction_hash);

    toast({ description: 'Giving approval to ricks for the reward token', duration: Infinity });
    transaction_response = await sendTransaction(erc20ContractInstance, 'approve', { spender: optionsAddress, amountLow: '1000000000', amountHigh: '0' })
    console.log(`Waiting for erc20 approve Tx ${transaction_response.transaction_hash} to be Accepted `);
    await getStarknet().provider.waitForTransaction(transaction_response.transaction_hash);

    transaction_response = await sendTransaction(nftOptionsContractInstance, 'register_put_bid', myStruct)
    console.log(`Waiting for register_put_bid Tx ${transaction_response.transaction_hash} to be Accepted `);
    await getStarknet().provider.waitForTransaction(transaction_response.transaction_hash);
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

