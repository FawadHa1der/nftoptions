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
import { sendTransaction } from 'utils/blockchain/starknet'
import formatDate from 'utils/formatDate'
import formatNumber from 'utils/formatNumber'

type Props = {
  put: PutDataWithNFT
} & MarginProps

const ExerciseCard = withSuspense(
  ({ put, ...styleProps }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const balance = useBalance()
    const handleClickExercise = async () => {
      setIsLoading(true)
      try {
        await sendTransaction(OPTIONS_CONTRACT_INSTANCE, 'exercise_put', { bid_id: put.bid_id })
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        setIsLoading(false)
        return
      }
      createToast({ description: 'Your transaction successful', variant: 'success' })
    }

    const isDisabled = put.status !== PutStatus.ACTIVE
    const { nftData, strike_price, expiry_date, premium } = put

    return (
      <Card {...styleProps} width={ACTION_CARD_WIDTH} height="max-content">
        <CardBody>
          <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
            <Text variant="heading">Sell PUT for</Text>
            <Text variant="heading">{nftData.name}</Text>
          </Flex>
          <Flex mt={6} flexDirection="column">
            <Flex alignItems="center">
              <Text color="light">Strike</Text>
              <Text ml="auto">{strike_price}</Text>
            </Flex>
            <Flex mt={4} alignItems="center">
              <Text color="light">Expiry</Text>
              <Text ml="auto">{formatDate(parseInt(expiry_date))}</Text>
            </Flex>
            <Flex mt={4} alignItems="center">
              <Text color="light">Premium</Text>
              <Text ml="auto">{formatNumber(parseInt(premium))}</Text>
            </Flex>
            <Flex mt={4} alignItems="center">
              <Text color="light">Balance</Text>
              <AmountUpdateText ml="auto" prevAmount={balance} newAmount={balance + parseInt(strike_price)} />
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
                  For {formatNumber(parseInt(strike_price), 0)} TT
                </Text>
              </>
            }
          />
          <Button
            mt={8}
            isDisabled={isDisabled}
            isLoading={isLoading}
            label="Exercise Put"
            variant="primary"
            size="large"
            onClick={handleClickExercise}
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
      <CardBody>
        <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      </CardBody>
    </Card>
  )
)

export default ExerciseCard
