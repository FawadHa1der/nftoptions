import Box from 'components/common/Box'
import Card from 'components/common/Card'
import CardBody from 'components/common/Card/CardBody'
import Flex from 'components/common/Flex'
import GalleryCard from 'components/common/GalleryCard'
import Grid from 'components/common/Grid'
import Spinner from 'components/common/Spinner'
import Text from 'components/common/Text'
import useMyLongPuts from 'hooks/useMyLongPuts'
import useMyNFTs, { NFTData } from 'hooks/useMyNFTs'
import withSuspense from 'hooks/withSuspense'
import { ACTION_CARD_WIDTH } from 'pages'
import React, { useState } from 'react'

export const GALLERY_CARD_WIDTH = 240

const BuyGallery = withSuspense(
  () => {
    const nfts = useMyNFTs()
    const myLongPuts = useMyLongPuts()
    const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null)
    const handleClickNFT = (nftData: NFTData) => {
      if (selectedNFT?.token_id === nftData.token_id) {
        setSelectedNFT(null)
      } else {
        setSelectedNFT(nftData)
      }
    }

    return (
      <Flex width="100%" sx={{ transition: 'all 0.2s ease-out' }}>
        <Box width="100%">
          {myLongPuts.length > 0 ? <Text variant="heading">My Puts</Text> : null}
          <Box width="100%">
            <Text mb={4} variant="heading">
              My NFTs
            </Text>
            <Grid
              width="100%"
              sx={{ gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`, columnGap: 6, rowGap: 6 }}
            >
              {nfts.map(nft => (
                <GalleryCard
                  key={nft.token_id}
                  nftData={nft}
                  onClick={handleClickNFT}
                  isSelected={selectedNFT?.token_id === nft.token_id}
                />
              ))}
            </Grid>
          </Box>
        </Box>
        {selectedNFT ? (
          <Card mt={50} ml={6} minWidth={ACTION_CARD_WIDTH}>
            <CardBody>
              <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
                <Text variant="heading">Buy PUT for</Text>
                <Text variant="heading"> {selectedNFT.name}</Text>
              </Flex>
            </CardBody>
          </Card>
        ) : null}
      </Flex>
    )
  },
  () => (
    <Flex height={300} flexDirection="column" width="100%" justifyContent="center" alignItems="center">
      <Spinner size="lg" color="primary" />
    </Flex>
  )
)

export default BuyGallery
