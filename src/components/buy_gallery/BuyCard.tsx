import Alert from 'components/common/Alert'
import AmountUpdateText from 'components/common/AmountUpdateText'
import Card from 'components/common/Card'
import CardBody from 'components/common/Card/CardBody'
import Flex from 'components/common/Flex'
import Input from 'components/common/Input'
import BigNumberInput from 'components/common/Input/BigNumberInput'
import Link from 'components/common/Link'
import Text from 'components/common/Text'
import { ZERO_BN } from 'constants/bn'
import BuyButton from 'containers/BuyButton'
import { BigNumber } from 'ethers'
import { NFTData } from 'hooks/useMyNFTs'
import { ACTION_CARD_WIDTH } from 'pages'
import React, { useMemo, useState } from 'react'
import { MarginProps } from 'types'
import formatDate from 'utils/formatDate'
import formatNumber from 'utils/formatNumber'

const INPUT_WIDTH = 160

type Props = {
  nftData: NFTData | null
  onTransact?: () => void
} & MarginProps

function formatToDateString(date: Date) {
  return date.toISOString().split('T')[0]
}

export default function BuyCard({ nftData, onTransact, ...styleProps }: Props): JSX.Element {
  const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000
  const [strikePrice, setStrikePrice] = useState<BigNumber>(ZERO_BN)
  const [expiry, setExpiry] = useState<string>(formatToDateString(new Date(tomorrow)))
  const expiryTimestamp = useMemo(() => {
    return new Date(expiry).setHours(23, 59) / 1000
  }, [expiry])
  const [premium, setPremium] = useState<BigNumber>(ZERO_BN)
  const expiryTooEarly = useMemo(() => expiryTimestamp < new Date().getTime() / 1000, [expiryTimestamp])
  const isDisabled = strikePrice.isZero() || premium.isZero() || !expiry || expiryTooEarly

  if (!nftData) {
    return (
      <Card {...styleProps} minWidth={ACTION_CARD_WIDTH} height={400}>
        <CardBody>
          <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
            <Text variant="heading">Select an NFT or PUT</Text>
          </Flex>
        </CardBody>
      </Card>
    )
  }
  const { name, aspect_link } = nftData

  return (
    <Card {...styleProps} minWidth={ACTION_CARD_WIDTH} height="max-content">
      <CardBody>
        <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
          <Text variant="heading">Buy PUT for</Text>
          <Text variant="heading"> {name}</Text>
        </Flex>
        <Flex mt={6} flexDirection="column">
          <Flex alignItems="center">
            <Text color="light">Strike</Text>
            <BigNumberInput
              placeholder="0 ETH"
              width={INPUT_WIDTH}
              ml="auto"
              value={strikePrice}
              onChange={val => setStrikePrice(val)}
              textAlign="right"
            />
          </Flex>
          <Flex mt={4} alignItems="center">
            <Text color="light">Expiry</Text>
            <Input
              ml="auto"
              error={
                new Date(expiry).getTime() < new Date().getTime() ? 'Expiry must be later than current time' : false
              }
              width={INPUT_WIDTH}
              type="date"
              value={expiry}
              onChange={evt => setExpiry(evt.target.value)}
            />
          </Flex>
          <Flex mt={4} alignItems="center">
            <Text color="light">Premium</Text>
            <BigNumberInput
              placeholder="0 ETH"
              width={INPUT_WIDTH}
              ml="auto"
              value={premium}
              onChange={val => setPremium(val)}
              textAlign="right"
            />
          </Flex>
          <Flex mt={4} alignItems="center">
            <Text color="light">Balance</Text>
            <AmountUpdateText ml="auto" prevAmount={ZERO_BN} newAmount={ZERO_BN} symbol="ETH" />
          </Flex>
          {!isDisabled ? (
            <Alert
              mt={4}
              textAlign="center"
              label={
                <>
                  <Text color="light" variant="secondary">
                    I will pay {formatNumber(premium, 0)} ETH for the right to sell
                  </Text>
                  <Text color="light" variant="bodyMedium">
                    {name}
                  </Text>
                  <Text color="light" variant="secondary">
                    For {formatNumber(strikePrice, 0)} ETH by {formatDate(expiryTimestamp, true)}
                  </Text>
                </>
              }
            />
          ) : null}
          <BuyButton
            mt={8}
            isDisabled={isDisabled}
            nftData={nftData}
            strikePrice={strikePrice}
            expiryTimestamp={expiryTimestamp}
            premium={premium}
            onTransact={onTransact}
          />
          <Link target="_blank" mx="auto" variant="secondary" mt={4} showRightIcon href={aspect_link}>
            View NFT on Aspect
          </Link>
        </Flex>
      </CardBody>
    </Card>
  )
}
