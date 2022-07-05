import { GALLERY_CARD_WIDTH } from 'containers/BuyGallery'
import useThemeColor from 'hooks/ui/useThemeColor'
import { PutData } from 'hooks/useBids'
import { NFTData } from 'hooks/useMyNFTs'
import React from 'react'
import { MarginProps } from 'styled-system'

import Card from '../Card'
import CardBody from '../Card/CardBody'
import Flex from '../Flex'
import Icon, { IconType } from '../Icon'
import Image from '../Image'
import Text from '../Text'

type Props = {
  nftData: NFTData
  option?: PutData
  isSelected?: boolean
  onClick?: (nftData: NFTData, option?: PutData) => void
} & MarginProps

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
            height="100%"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              background: background + '80',
              transition: 'opacity 0.15s ease-out',
              backdropFilter: 'blur(4px)',
              opacity: isSelected ? 1 : 0,
            }}
          >
            <Icon color="primary" icon={IconType.Check} size={80} />
          </Flex>
          <Image src={nftData.image_url_copy} size={180} />
        </Flex>
        <Text my={3} variant="bodyMedium">
          {nftData.name}
        </Text>
        {option ? <></> : <Text>{nftData.description}</Text>}
      </CardBody>
    </Card>
  )
}
