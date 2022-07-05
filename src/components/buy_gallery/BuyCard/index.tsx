import Alert from 'components/common/Alert'
import Card from 'components/common/Card'
import CardBody from 'components/common/Card/CardBody'
import Flex from 'components/common/Flex'
import Input from 'components/common/Input'
import Link from 'components/common/Link'
import Text from 'components/common/Text'
import BuyButton from 'containers/BuyButton'
import useBalance from 'hooks/useBalance'
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
  const balance = useBalance()
  const [strikePrice, setStrikePrice] = useState<string>('')
  const [expiry, setExpiry] = useState<string>(formatToDateString(new Date(tomorrow)))
  const expiryTimestamp = useMemo(() => {
    return new Date(expiry).setHours(23, 59) / 1000
  }, [expiry])
  // const [premium, setPremium] = useState<BigNumber>(ZERO_BN)
  const [premium, setPremium] = useState<string>('')
  const expiryTooEarly = useMemo(() => expiryTimestamp < new Date().getTime() / 1000, [expiryTimestamp])
  const isDisabled = isNaN(parseInt(strikePrice)) || isNaN(parseInt(premium)) || expiryTooEarly
  // const isDisabled = strikePriceBN.isZero() || premium.isZero() || !expiry || expiryTooEarly

  if (!nftData) {
    return (
      <Card {...styleProps} minWidth={ACTION_CARD_WIDTH} height={400}>
        <CardBody>
          <Text mx="auto" variant="heading">
            Select an NFT or PUT
          </Text>
        </CardBody>
      </Card>
    )
  }
  const { name, aspect_link } = nftData

  return (
    <Card {...styleProps} width={ACTION_CARD_WIDTH} height="max-content">
      <CardBody>
        <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
          <Text variant="heading">Buy PUT for</Text>
          <Text variant="heading"> {name}</Text>
        </Flex>
        <Flex mt={6} flexDirection="column">
          <Flex alignItems="center">
            <Text color="light">Strike</Text>
            <Input
              type="number"
              placeholder="0 ETH"
              width={INPUT_WIDTH}
              ml="auto"
              value={strikePrice}
              onChange={(evt: any) => setStrikePrice(evt.target.value)}
              textAlign="right"
            ></Input>
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
              onChange={(evt: any) => setExpiry(evt.target.value)}
            />
          </Flex>
          <Flex mt={4} alignItems="center">
            <Text color="light">Premium</Text>
            <Input
              type="number"
              placeholder="0 ETH"
              width={INPUT_WIDTH}
              ml="auto"
              value={premium}
              onChange={(evt: any) => setPremium(evt.target.value)}
              textAlign="right"
            />
          </Flex>
          {/* <Flex mt={4} alignItems="center">
            <Text color="light">Balance</Text>
            <AmountUpdateText
              ml="auto"
              prevAmount={BigNumber.from(balance)}
              newAmount={parseUnits('1000', 18)}
              symbol="ETH"
            />
          </Flex> */}
          {!isDisabled ? (
            <Alert
              mt={6}
              textAlign="center"
              label={
                <>
                  <Text color="light" variant="secondary">
                    I will pay {formatNumber(parseInt(premium), 0)} ETH for the right to sell
                  </Text>
                  <Text color="light" variant="bodyMedium">
                    {name}
                  </Text>
                  <Text color="light" variant="secondary">
                    For {formatNumber(parseInt(strikePrice), 0)} ETH by {formatDate(expiryTimestamp, true)}
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
