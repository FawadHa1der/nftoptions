import erc721compiledcontract from 'compiledcairo/erc721.json'
import Button from 'components/common/Button'
import ButtonShimmer from 'components/common/Shimmer/ButtonShimmer'
import { createToast } from 'components/common/Toast'
import { ERC20_CONTRACT_INSTANCE, OPTIONS_CONTRACT_ADDRESS, OPTIONS_CONTRACT_INSTANCE } from 'constants/contracts'
import { getStarknet } from 'get-starknet'
import useIsERC721Approved from 'hooks/useIsApproved'
import { NFTData } from 'hooks/useMyNFTs'
import useWallet from 'hooks/useWallet'
import withSuspense from 'hooks/withSuspense'
import React, { useState } from 'react'
import { Contract, uint256 } from 'starknet'
import { MarginProps } from 'styled-system'
import { callContract, sendTransaction } from 'utils/blockchain/starknet'
import getUint256CalldataFromBN from 'utils/getUint256CalldataFromBN'
import { BN } from 'bn.js'

type Props = {
  strikePrice: string
  premium: string
  expiryTimestamp: number
  nftData: NFTData
  isDisabled: boolean
  onTransact?: () => void
} & MarginProps

const BuyButton = withSuspense(
  ({ nftData, strikePrice, premium, expiryTimestamp, isDisabled, onTransact, ...styleProps }: Props) => {
    const { contract_address, token_id } = nftData
    const address = useWallet()
    const strikePriceUint256 = getUint256CalldataFromBN(strikePrice.toString())
    const erc721_id = getUint256CalldataFromBN(nftData.token_id)
    const premiumUint256 = getUint256CalldataFromBN(premium.toString())
    const isERC721Approved = useIsERC721Approved(contract_address, token_id)

    const [isLoading, setIsLoading] = useState(false)
    async function handleClickApprove() {
      const erc721ContractInstance = new Contract((erc721compiledcontract as any).abi, contract_address)
      await sendTransaction(erc721ContractInstance, 'approve', { to: OPTIONS_CONTRACT_ADDRESS, tokenId: erc721_id })
    }

    async function handleClickBuy() {
      setIsLoading(true)
      /*struct ERC721PUT:
            member strike_price : Uint256
            member expiry_date : felt
            member erc721_address : felt
            member erc721_id : Uint256
            member premium : Uint256
        end
        8 fields in the transaction
         */
      const paramStruct = {
        a: strikePriceUint256,
        b: expiryTimestamp,
        c: nftData.contract_address,
        d: erc721_id,
        e: premiumUint256,
      }
      const balanceResult = await callContract(
        ERC20_CONTRACT_INSTANCE,
        'balanceOf',
        address
      )

      const existingBalance = uint256.uint256ToBN(balanceResult[0])
      if (existingBalance.ltn(parseInt(premium))) {
        setIsLoading(false)
        createToast({
          description: 'Not enough balance/TEST tokens in your wallet.',
          variant: 'error',
        })
      }

      const allowanceResult = await callContract(
        ERC20_CONTRACT_INSTANCE,
        'allowance',
        address,
        OPTIONS_CONTRACT_ADDRESS
      )

      const existingMoneyAllowance = uint256.uint256ToBN(allowanceResult[0])
      console.log('allowance   ', existingMoneyAllowance)
      if (existingMoneyAllowance.ltn(parseInt(premium))) {
        try {
          await sendTransaction(ERC20_CONTRACT_INSTANCE, 'approve', {
            spender: OPTIONS_CONTRACT_ADDRESS,
            amount: getUint256CalldataFromBN(100000000),
          })
        } catch (e) {
          setIsLoading(false)
          createToast({
            description: 'Cancelled approval in wallet',
            variant: 'error',
          })
          return
        }
      }

      createToast({ description: 'Registering your bid now', autoClose: 5000 })
      try {
        const transaction_response = await sendTransaction(OPTIONS_CONTRACT_INSTANCE, 'register_put_bid', paramStruct)
        console.log(`Waiting for register_put_bid Tx ${transaction_response.transaction_hash} to be Accepted `)
        await getStarknet().provider.waitForTransaction(transaction_response.transaction_hash)
        if (onTransact) {
          console.log('onTransact')
          onTransact()
        }
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        createToast({
          description: 'Cancelled transaction in wallet',
          variant: 'error',
        })
        setIsLoading(false)
        return
      }

      createToast({
        description: 'Success, your bid is registered.',
        variant: 'success',
        autoClose: 5000,
      })
    }
    return (
      <Button
        {...styleProps}
        isLoading={isLoading}
        isDisabled={isERC721Approved && isDisabled}
        label={isERC721Approved ? 'Buy PUT' : 'Approve'}
        variant="primary"
        size="lg"
        onClick={isERC721Approved ? handleClickBuy : handleClickApprove}
      />
    )
  },
  ({ nftData, strikePrice, premium, expiryTimestamp, onTransact, ...styleProps }: Props) => (
    <ButtonShimmer {...styleProps} width="100%" size="lg" />
  )
)

export default BuyButton
