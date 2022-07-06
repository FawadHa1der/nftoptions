import Button from 'components/common/Button'
import ButtonShimmer from 'components/common/Shimmer/ButtonShimmer'
import { createToast } from 'components/common/Toast'
import { ERC20_CONTRACT_INSTANCE, OPTIONS_CONTRACT_ADDRESS, OPTIONS_CONTRACT_INSTANCE } from 'constants/contracts'
import useIsERC20Approved from 'hooks/useIsERC20Approved'
import { PutDataWithNFT } from 'hooks/usePuts'
import withSuspense from 'hooks/withSuspense'
import React, { useState } from 'react'
import { MarginProps } from 'types'
import { sendTransaction, waitForTransaction } from 'utils/blockchain/starknet'
import getUint256CalldataFromBN from 'utils/getUint256CalldataFromBN'

type Props = {
  put: PutDataWithNFT
  isDisabled?: boolean
  onTransact?: () => void
} & MarginProps

const SellButton = withSuspense(
  ({ put, onTransact, isDisabled = false, ...styleProps }: Props) => {
    const [isERC20Approved, mutate] = useIsERC20Approved()
    const [isLoading, setIsLoading] = useState(false)
    const handleClickApprove = async () => {
      try {
        setIsLoading(true)
        const txReceipt = await sendTransaction(ERC20_CONTRACT_INSTANCE, 'approve', {
          spender: OPTIONS_CONTRACT_ADDRESS,
          amount: getUint256CalldataFromBN(100000000),
        })
        const txStatus = await waitForTransaction(txReceipt.transaction_hash)
        console.log('transaction done', txStatus)
        if (onTransact) {
          onTransact()
        }
        mutate()

        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        return
      }
    }

    const handleClickSell = async () => {
      try {
        setIsLoading(true)
        console.log({ bidId: put.bid_id })
        const tx = await sendTransaction(OPTIONS_CONTRACT_INSTANCE, 'register_put_sell', { bid_id_: put.bid_id })
        const txStatus = await waitForTransaction(tx.transaction_hash)
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
        onClick={isERC20Approved ? handleClickSell : handleClickApprove}
      />
    )
  },
  ({ put, onTransact, ...styleProps }: Props) => <ButtonShimmer {...styleProps} size="lg" width="100%" />
)

export default SellButton
