import Alert from 'components/common/Alert'
import AmountUpdateText from 'components/common/AmountUpdateText'
import Card from 'components/common/Card'
import CardBody from 'components/common/Card/CardBody'
import Flex from 'components/common/Flex'
import Link from 'components/common/Link'
import Spinner from 'components/common/Spinner'
import Text from 'components/common/Text'
import SellButton from 'containers/SellButton'
import useBalance from 'hooks/useBalance'
import { PutStatus } from 'hooks/useBids'
import { PutDataWithNFT } from 'hooks/usePuts'
import withSuspense from 'hooks/withSuspense'
import { ACTION_CARD_WIDTH } from 'pages'
import React from 'react'
import { MarginProps } from 'types'
import formatDate from 'utils/formatDate'
import formatNumber from 'utils/formatNumber'

type Props = {
  put: PutDataWithNFT | null
  onTransact?: () => void
} & MarginProps

const SellCard = withSuspense(
  ({ put, onTransact, ...styleProps }: Props) => {
    const balance = useBalance()

    if (!put) {
      return (
        <Card {...styleProps} minWidth={ACTION_CARD_WIDTH} height={368}>
          <CardBody>
            <Text mx="auto" variant="heading">
              Select a PUT
            </Text>
          </CardBody>
        </Card>
      )
    }

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
              <AmountUpdateText
                ml="auto"
                symbol="TT"
                prevAmount={balance}
                newAmount={balance - parseInt(strike_price) + parseInt(premium)}
              ></AmountUpdateText>
            </Flex>
          </Flex>
          <Alert
            mt={6}
            textAlign="center"
            label={
              <>
                <Text color="light" variant="secondary">
                  I agree to buy
                </Text>
                <Text color="light" variant="bodyMedium">
                  {nftData.name}
                </Text>
                <Text color="light" variant="secondary">
                  For {formatNumber(parseInt(strike_price), 0)} TT and will receive {formatNumber(parseInt(premium), 0)}{' '}
                  TT for the agreement
                </Text>
              </>
            }
          />
          <SellButton mt={8} put={put} onTransact={onTransact} isDisabled={put.status === PutStatus.ACTIVE} />
          <Link target="_blank" mx="auto" variant="secondary" mt={4} showRightIcon href={nftData.aspect_link}>
            View NFT on Aspect
          </Link>
        </CardBody>
      </Card>
    )
  },
  ({ put, onTransact, ...styleProps }: Props) => (
    <Card {...styleProps} minWidth={ACTION_CARD_WIDTH} height={368}>
      <CardBody>
        <Text mx="auto" variant="heading">
          Select a PUT
        </Text>
        <Flex height="100%" width="100%">
          <Spinner my="auto" mx="auto" />
        </Flex>
      </CardBody>
    </Card>
  )
)

export default SellCard
