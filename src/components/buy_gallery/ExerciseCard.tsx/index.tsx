import { Spinner } from '@chakra-ui/react'
import Alert from 'components/common/Alert'
import AmountUpdateText from 'components/common/AmountUpdateText'
import Button from 'components/common/Button'
import Card from 'components/common/Card'
import CardBody from 'components/common/Card/CardBody'
import Flex from 'components/common/Flex'
import Link from 'components/common/Link'
import Text from 'components/common/Text'
import { createToast } from 'components/common/Toast'
import { OPTIONS_CONTRACT_INSTANCE } from 'constants/contracts'
import useBalance from 'hooks/useBalance'
import { PutStatus } from 'hooks/useBids'
import { PutDataWithNFT } from 'hooks/usePuts'
import withSuspense from 'hooks/withSuspense'
import { ACTION_CARD_WIDTH } from 'pages'
import React, { useState } from 'react'
import { MarginProps } from 'styled-system'
import { starknet } from 'utils/blockchain'
import { sendTransaction, waitForTransaction } from 'utils/blockchain/starknet'
import formatDate from 'utils/formatDate'
import formatUSD from 'utils/formatUSD'
import { getStarknet } from 'get-starknet'
type Props = {
  put: PutDataWithNFT
  onTransact?: () => void
} & MarginProps

const ExerciseCard = withSuspense(
  ({ put, onTransact, ...styleProps }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const balance = useBalance()
    const handleClickExercise = async () => {
      setIsLoading(true)
      try {
        const tx = await sendTransaction(OPTIONS_CONTRACT_INSTANCE, 'exercise_put', { bid_id: put.bid_id })
        await getStarknet().provider.waitForTransaction(tx.transaction_hash)
        setIsLoading(false)
        if (onTransact) {
          onTransact()
        }
      } catch (e) {
        console.error(e)
        setIsLoading(false)
        return
      }
      createToast({ description: 'Your transaction successful', variant: 'success' })
    }

    const handleClickCancel = async () => {
      setIsLoading(true)
      try {
        const tx = await sendTransaction(OPTIONS_CONTRACT_INSTANCE, 'cancel_put_bid', { bid_id: put.bid_id })
        await getStarknet().provider.waitForTransaction(tx.transaction_hash)
        setIsLoading(false)
        if (onTransact) {
          onTransact()
        }
      } catch (e) {
        console.error(e)
        setIsLoading(false)
        return
      }
      createToast({ description: 'Your transaction successful', variant: 'success' })
    }


    const isCancellable = put.status !== PutStatus.ACTIVE
    const { nftData, strike_price, expiry_date, premium } = put

    return (
      <Card {...styleProps} minWidth={ACTION_CARD_WIDTH} width={ACTION_CARD_WIDTH} height="max-content">
        <CardBody>
          <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
            <Text variant="heading">Sell PUT for</Text>
            <Text variant="heading">{nftData.name}</Text>
          </Flex>
          <Flex mt={6} flexDirection="column">
            <Flex alignItems="center">
              <Text color="light">Strike</Text>
              <Text ml="auto">{formatUSD(parseInt(strike_price))}</Text>
            </Flex>
            <Flex mt={4} alignItems="center">
              <Text color="light">Expiry</Text>
              <Text ml="auto">{formatDate(parseInt(expiry_date))}</Text>
            </Flex>
            <Flex mt={4} alignItems="center">
              <Text color="light">Premium</Text>
              <Text ml="auto">{formatUSD(parseInt(premium))}</Text>
            </Flex>
            <Flex mt={4} alignItems="center">
              <Text color="light">Balance</Text>
              <AmountUpdateText
                ml="auto"
                isUSDFormat={true}
                prevAmount={balance}
                newAmount={balance + parseInt(strike_price)}
              />
            </Flex>
          </Flex>
          <Alert
            mt={6}
            textAlign="center"
            label={
              <>
                <Text color="light" variant="secondary">
                  I will sell
                </Text>
                <Text color="light" variant="bodyMedium">
                  {nftData.name}
                </Text>
                <Text color="light" variant="secondary">
                  For {formatUSD(parseInt(strike_price), 0)}
                </Text>
              </>
            }
          />
          <Button
            mt={8}
            isLoading={isLoading}
            label={isCancellable ? "Cancel my bid" : "Exercise Put"}
            variant="primary"
            size="large"
            onClick={isCancellable ? handleClickCancel : handleClickExercise}
          />
          <Link target="_blank" mx="auto" variant="secondary" mt={4} showRightIcon href={nftData.aspect_link}>
            View NFT on Aspect
          </Link>
        </CardBody>
      </Card>
    )
  },
  ({ put, ...styleProps }: Props) => (
    <Card {...styleProps} width={ACTION_CARD_WIDTH} height="max-content">
      <CardBody height="100%">
        <Flex height="100%" width="100%" flexDirection="column" justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      </CardBody>
    </Card>
  )
)

export default ExerciseCard
