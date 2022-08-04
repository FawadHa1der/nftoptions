import Button from 'components/common/Button'
import ButtonShimmer from 'components/common/Shimmer/ButtonShimmer'
import { createToast } from 'components/common/Toast'
import { ERC20_CONTRACT_INSTANCE, OPTIONS_CONTRACT_ADDRESS, OPTIONS_CONTRACT_INSTANCE } from 'constants/contracts'
import useIsERC20Approved from 'hooks/useIsERC20Approved'
import { PutDataWithNFT } from 'hooks/usePuts'
import withSuspense from 'hooks/withSuspense'
import React, { useState } from 'react'
import { MarginProps } from 'types'
import { callContract, constructTransaction, sendTransaction, sendTransactions, waitForTransaction } from 'utils/blockchain/starknet'
import getUint256CalldataFromBN from 'utils/getUint256CalldataFromBN'
import useWallet from 'hooks/useWallet'
import { Contract, uint256 } from 'starknet'
import { getStarknet } from 'get-starknet'

type Props = {
  put: PutDataWithNFT
  strike_price: string
  isDisabled?: boolean
  onTransact?: () => void
} & MarginProps

const SellButton = withSuspense(
  ({ put, onTransact, strike_price, isDisabled = false, ...styleProps }: Props) => {
    const [isERC20Approved, mutate] = useIsERC20Approved()
    const [isLoading, setIsLoading] = useState(false)
    const address = useWallet()
    // const strikePriceUint256 = getUint256CalldataFromBN(strike_price.toString())


    const handleClickSell = async () => {
      try {
        setIsLoading(true)
        const balanceResult = await callContract(ERC20_CONTRACT_INSTANCE, 'balanceOf', address)

        const existingBalance = uint256.uint256ToBN(balanceResult[0])
        if (existingBalance.ltn(parseInt(strike_price.toString()))) {
          setIsLoading(false)
          createToast({
            description: 'Not enough balance/TEST tokens in your wallet.',
            variant: 'error',
          })
          return
        }
        let transactions: any = []

        const allowanceResult = await callContract(
          ERC20_CONTRACT_INSTANCE,
          'allowance',
          address,
          OPTIONS_CONTRACT_ADDRESS
        )

        const existingMoneyAllowance = uint256.uint256ToBN(allowanceResult[0])
        if (existingMoneyAllowance.ltn(parseInt(strike_price))) {
          transactions.push(constructTransaction(ERC20_CONTRACT_INSTANCE, 'approve', {
            spender: OPTIONS_CONTRACT_ADDRESS,
            amount: getUint256CalldataFromBN(100000000),
          }))
        }

        createToast({ description: 'Selling your put now', autoClose: 5000 })
        try {
          transactions.push(constructTransaction(OPTIONS_CONTRACT_INSTANCE, 'register_put_sell', { bid_id_: put.bid_id }))
          const transaction_response = await sendTransactions(transactions)
          console.log(`Waiting for register_put_sell Tx ${transaction_response.transaction_hash} to be Accepted `)
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
        setIsLoading(false)
        createToast({ description: 'Your transaction was successful' })
      } catch (e) {
        console.error(e)
        setIsLoading(false)
        return
      }
    }

    return (
      <Button
        {...styleProps}
        isDisabled={isDisabled}
        isLoading={isLoading}
        label={isERC20Approved ? 'Sell Put' : 'Approve'}
        variant="primary"
        size="large"
        onClick={handleClickSell}
      />
    )
  },
  ({ put, onTransact, ...styleProps }: Props) => <ButtonShimmer {...styleProps} size="lg" width="100%" />
)

export default SellButton
