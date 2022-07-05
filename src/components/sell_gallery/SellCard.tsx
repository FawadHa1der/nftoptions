import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import Card from 'components/common/Card'
import CardBody from 'components/common/Card/CardBody'
import Flex from 'components/common/Flex'
import Link from 'components/common/Link'
import Text from 'components/common/Text'
import { sellPut } from 'containers/SellGallery/transactions'
import { PutDataWithNFT } from 'hooks/usePuts'
import { ACTION_CARD_WIDTH } from 'pages'
import React from 'react'
import { MarginProps } from 'styled-system'
import formatNumber from 'utils/formatNumber'

type Props = {
  put: PutDataWithNFT | null
} & MarginProps

export default function SellCard({ put, ...styleProps }: Props): JSX.Element {
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

  const handleClickSell = () => sellPut(put)

  const { nftData, strike_price, expiry_date, premium } = put
  return (
    <Card {...styleProps} width={ACTION_CARD_WIDTH}>
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
            <Text ml="auto">{expiry_date}</Text>
          </Flex>
          <Flex mt={4} alignItems="center">
            <Text color="light">Premium</Text>
            <Text ml="auto">{formatNumber(parseInt(premium))}</Text>
          </Flex>
          {/* <Flex mt={4} alignItems="center">
            <Text color="light">Balance</Text>
            <Text ml="auto">{0} ETH</Text>
          </Flex> */}
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
                For {formatNumber(parseInt(strike_price), 0)} ETH and will receive {formatNumber(parseInt(premium), 0)}{' '}
                ETH for the agreement
              </Text>
            </>
          }
        />
        <Button mt={8} label="Sell Put" variant="primary" size="large" onClick={handleClickSell} />
        <Link target="_blank" mx="auto" variant="secondary" mt={4} showRightIcon href={nftData.aspect_link}>
          View NFT on Aspect
        </Link>
      </CardBody>
    </Card>
  )
}
