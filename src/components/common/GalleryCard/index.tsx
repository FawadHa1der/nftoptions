import { GALLERY_CARD_WIDTH } from 'containers/BuyGallery'
import { PutData } from 'hooks/useBids'
import { NFTData } from 'hooks/useMyNFTs'
import React from 'react'
import { MarginProps } from 'styled-system'

import Card from '../Card'
import CardBody from '../Card/CardBody'
import Flex from '../Flex'
import Image from '../Image'
import Text from '../Text'

type Props = {
  nftData: NFTData
  option?: PutData
} & MarginProps

export default function GalleryCard({ nftData, option }: Props): JSX.Element {
  return (
    <Card
      minWidth={GALLERY_CARD_WIDTH}
      onClick={() => {
        console.log(nftData)
      }}
    >
      <CardBody>
        <Flex width="100%" justifyContent="center">
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
