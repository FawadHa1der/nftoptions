import { GALLERY_CARD_WIDTH } from 'containers/BuyGallery'
import useThemeColor from 'hooks/ui/useThemeColor'
import { PutStatus } from 'hooks/useBids'
import { NFTData } from 'hooks/useMyNFTs'
import { PutDataWithNFT } from 'hooks/usePuts'
import React from 'react'
import { MarginProps } from 'styled-system'
import formatDate from 'utils/formatDate'
import formatUSD from 'utils/formatUSD'

import Box from '../Box'
import Card from '../Card'
import CardBody from '../Card/CardBody'
import Flex from '../Flex'
import Icon, { IconType } from '../Icon'
import Image from '../Image'
import Text from '../Text'
import Token from '../Token'

type Props = {
  nftData: NFTData
  option?: PutDataWithNFT
  isSelected?: boolean
  onClick?: (nftData: NFTData, option?: PutDataWithNFT) => void
} & MarginProps

const getTokenLabel = (optionStatus: PutStatus) => {
  switch (optionStatus) {
    case PutStatus.OPEN:
      return 'Offered'
    case PutStatus.ACTIVE:
      return 'Filled'
    case PutStatus.CLOSED:
      return 'Expired'
  }
}

const getTokenVariant = (optionStatus: PutStatus) => {
  switch (optionStatus) {
    case PutStatus.OPEN:
      return 'default'
    case PutStatus.ACTIVE:
      return 'primary'
    case PutStatus.CLOSED:
      return 'error'
  }
}

export default function GalleryCard({ nftData, option, onClick: handleClick, isSelected = false }: Props): JSX.Element {
  const background = useThemeColor('background')
  return (
    <Card
      minWidth={GALLERY_CARD_WIDTH}
      onClick={() => {
        if (handleClick) {
          handleClick(nftData, option)
        }
      }}
      sx={{
        ':hover': {
          bg: 'buttonHover',
          cursor: 'pointer',
        },
      }}
    >
      <CardBody>
        <Flex width="100%" justifyContent="center" sx={{ position: 'relative' }}>
          <Flex
            justifyContent="center"
            alignItems="center"
            width="100%"
            sx={{
              position: 'absolute',
              top: 0,
              background: background + '80',
              transition: 'opacity 0.15s ease-out',
              backdropFilter: 'blur(4px)',
              opacity: isSelected ? 1 : 0,
              borderRadius: 20,
              aspectRatio: '1 / 1',
            }}
          >
            <Icon color="primary" icon={IconType.Check} size={80} />
          </Flex>
          <Box sx={{ borderRadius: 20, aspectRatio: '1 / 1' }} overflow="hidden" width="100%">
            <Image src={nftData.image_url_copy} height="100%" width="100%" sx={{ objectFit: 'cover' }} />
          </Box>
        </Flex>
        <Text my={3} variant="bodyMedium">
          {nftData.name}
        </Text>
        {option ? (
          <Flex flexDirection="column">
            <Text variant="secondary" color="light">
              {formatUSD(parseInt(option.strike_price), 0)} PUT Exp. {formatDate(parseInt(option.expiry_date), true)}
            </Text>
            <Flex mt={4}>
              <Token label={getTokenLabel(option.status)} variant={getTokenVariant(option.status)} />
              <Token ml={2} label={formatUSD(parseInt(option.premium))} variant="primary" />
            </Flex>
          </Flex>
        ) : (
          <Text variant="secondary" color="light">
            {nftData.description}
          </Text>
        )}
      </CardBody>
    </Card>
  )
}
