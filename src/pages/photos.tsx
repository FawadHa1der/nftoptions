import { AtSignIcon } from '@chakra-ui/icons'
import { Box, Button, Divider, Flex, Spacer, Text } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { PutOptionForm } from 'components/wallet'
import { IPutOptionForm, PutOptionFormType } from 'components/wallet/PutOptionForm'
import { utils } from 'ethers'
import { getStarknet } from 'get-starknet'
import { NFTData } from 'hooks/useMyNFTs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import React, { useEffect } from 'react'
import { Contract, json, number, uint256 } from 'starknet'
import { sendTransaction } from 'utils/blockchain/starknet'
import { callContract } from 'utils/blockchain/starknet'
import { PutData } from 'hooks/useBids'

import erc20compiledcontract from '../compiledcairo/erc20.json'
import erc721compiledcontract from '../compiledcairo/erc721.json'
import optionscompiledcontract from '../compiledcairo/erc721_option.json'

function getUint256CalldataFromBN(bn: number.BigNumberish) {
  return { type: 'struct' as const, ...uint256.bnToUint256(bn) }
}

function parseInputAmountToUint256(input: string, decimals = 18) {
  return getUint256CalldataFromBN(utils.parseUnits(input, decimals).toString())
}

export default function Photos() {
  //  let formType: PutOptionFormType = PutOptionFormType.CREATE;
  const optionsAddress = '0x02e6a26d2fcb7256934c822ad8a81ee40aed922b271495d8eb1e05d031192f52'
  const erc20Address = '0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10' // argentx test token

  const toast = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState<IPutOptionForm>()
  const [pic, setPic] = useState<NFTData>()
  const [putData, setPutData] = useState<PutData>() // if this is null it means we are creating a bid/put
  const [formType, setFormType] = useState<PutOptionFormType>()
  useEffect(() => {
    if (router.query.nft) setPic(json.parse(router.query.nft as string) as NFTData)

    if (router.query.putData) {
      const tempPutData = json.parse(router.query.putData as string) as PutData
      setPutData(tempPutData)
    }

    if (router.query.formType) {
      const tempTypeData = json.parse(router.query.formType as string) as PutOptionFormType
      setFormType(tempTypeData)
    }
  }, [router.query])

  async function onRegistered(optionData: IPutOptionForm) {
    console.log('optionData -->' + JSON.stringify(optionData))
    const date = new Date(optionData.expiry_date)

    const erc721_address = pic?.contract_address ? pic?.contract_address : ''
    const nftOptionsContractInstance = new Contract(optionscompiledcontract.abi as any, optionsAddress)
    const erc20ContractInstance = new Contract(erc20compiledcontract.abi as any, erc20Address)
    const erc721ContractInstance = new Contract(erc721compiledcontract.abi as any, erc721_address)
    const expiry_date_in_sec = new Date().getTime()
    console.log('expiry_date_in_sec -> ' + expiry_date_in_sec)
    setFormData(optionData)

    if (formType == PutOptionFormType.CREATE) {
      toast({ description: 'You will be asked to confirm multiple times' })

      const strike_price = getUint256CalldataFromBN(optionData.strike_price)
      const expiry_date = expiry_date_in_sec
      const erc721_id = getUint256CalldataFromBN(pic?.token_id ? pic?.token_id : 0)
      const premium = getUint256CalldataFromBN(optionData.premium)
      // const buyer_address = ''
      const paramStruct = {
        a: strike_price,
        b: expiry_date,
        c: erc721_address,
        d: erc721_id,
        e: premium,
      }

      const approvedResult: any = await callContract(erc721ContractInstance, 'getApproved', erc721_id)
      const approvedAddress = approvedResult[0]
      console.log('isApprovedResult   ', JSON.stringify(approvedAddress))

      const myAddress = getStarknet().account.address
      if (approvedAddress.toString(16) !== getStarknet().account.address) {
        await sendTransaction(erc721ContractInstance, 'approve', { to: optionsAddress, tokenId: erc721_id })
      }

      const allowanceResult = await callContract(
        erc20ContractInstance,
        'allowance',
        getStarknet().account.address,
        optionsAddress
      )
      //const unit256Allowance: Uint256 = allowance
      const existingMoneyAllowance = uint256.uint256ToBN(allowanceResult[0]).toNumber()
      console.log('allowance   ', existingMoneyAllowance)

      if (existingMoneyAllowance < parseInt(optionData.premium)) {
        await sendTransaction(erc20ContractInstance, 'approve', {
          spender: optionsAddress,
          amount: getUint256CalldataFromBN(100000000),
        })
      }

      toast({ description: 'Registering your bid now' })
      const transaction_response = await sendTransaction(nftOptionsContractInstance, 'register_put_bid', paramStruct)

      console.log(`Waiting for register_put_bid Tx ${transaction_response.transaction_hash} to be Accepted `)
      await getStarknet().provider.waitForTransaction(transaction_response.transaction_hash)
      console.log('completed all the approvals')
      toast({ description: 'Success, your bid is registered, data will take a few mins to reflect in the UI' })
    } else if (formType == PutOptionFormType.YOUR_OPEN_BID) {
      toast({ description: 'Cancelling your bid now' })
      const transaction_response = await sendTransaction(nftOptionsContractInstance, 'cancel_put_bid', {
        bid_id: putData?.bid_id,
      })
      toast({ description: 'Bid cancelled, data will take a few mins to reflect in the UI' })
    } else if (formType == PutOptionFormType.OPEN_BIDS) {
      const allowanceResult = await callContract(
        erc20ContractInstance,
        'allowance',
        getStarknet().account.address,
        optionsAddress
      )
      //const unit256Allowance: Uint256 = allowance
      const existingMoneyAllowance = uint256.uint256ToBN(allowanceResult).toNumber()
      console.log('allowance   ', existingMoneyAllowance)

      if (existingMoneyAllowance < parseInt(optionData.strike_price)) {
        await sendTransaction(erc20ContractInstance, 'approve', {
          spender: optionsAddress,
          amount: getUint256CalldataFromBN(100000000),
        })
      }

      toast({ description: 'Selling the put option' })
      const transaction_response = await sendTransaction(nftOptionsContractInstance, 'register_put_sell', {
        bid_id: putData?.bid_id,
      })
      toast({ description: 'The option is active now, data will take a few mins to reflect in the UI' })
    } else if (formType == PutOptionFormType.ACTIVE_BIDS_EXERCISABLE) {
      toast({ description: 'Selling the put option' })
      const transaction_response = await sendTransaction(nftOptionsContractInstance, 'exercise_put', {
        bid_id: putData?.bid_id,
      })
      toast({ description: 'The option is active now, data will take a few mins to reflect in the UI' })
    }
  }

  return (
    <Box p="2rem" minH="80vh" style={{ border: '#666666 1px solid', borderRadius: '50px' }}>
      <Flex px="1rem" justify="center" align="center">
        <Text letterSpacing="wide" textDecoration="underline" as="h2" fontWeight="semibold" fontSize="xl">
          <AtSignIcon />
          {pic?.name}
        </Text>
        <Spacer />
        <Link href="/">
          <Button as="a" borderRadius="full" colorScheme="cyan" fontSize="lg" size="lg" cursor="pointer">
            🏠 Home
          </Button>
        </Link>
      </Flex>
      <Divider my="1rem" />
      <Flex paddingBottom={30}>
        <Box as="a" target="_blank" href={pic?.image_url_copy}>
          <Image
            src={pic ? (pic.image_url_copy ? pic.image_url_copy : '/vercel.svg') : '/vercel.svg'}
            width={300}
            height={300}
            style={{ borderRadius: '5px!important', float: 'left' }}
            loading="eager"
            alt="nft image"
          />
        </Box>
        <Box px="1rem" width="50%">
          <Text fontSize="l" fontWeight="light">
            {pic?.description ? pic?.description : 'No description'}
          </Text>
        </Box>
      </Flex>
      <PutOptionForm onRegistered={onRegistered} nftdata={pic} putdata={putData} formType={formType} />
    </Box>
  )
}
