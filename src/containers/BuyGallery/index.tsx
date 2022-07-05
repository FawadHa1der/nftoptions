import Box from 'components/common/Box'
import Flex from 'components/common/Flex'
import GalleryCard from 'components/common/GalleryCard'
import Grid from 'components/common/Grid'
import Spinner from 'components/common/Spinner'
import Text from 'components/common/Text'
import useMyNFTs from 'hooks/useMyNFTs'
import withSuspense from 'hooks/withSuspense'
import React from 'react'

export const GALLERY_CARD_WIDTH = 240

const BuyGallery = withSuspense(
  () => {
    const nfts = useMyNFTs()
    return (
      <Flex width="100%">
        <Box width="100%">
          <Text variant="heading">My Puts</Text>
          <Box width="100%">
            <Text mb={4} variant="heading">
              My NFTs
            </Text>
            <Grid
              width="100%"
              sx={{ gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`, columnGap: 6, rowGap: 6 }}
            >
              {nfts.map(nft => (
                <GalleryCard key={nft.token_id} nftData={nft} />
              ))}
            </Grid>
          </Box>
        </Box>
      </Flex>
    )
  },
  () => (
    <Flex flexDirection="column" width="100%">
      <Text variant="heading">My Puts</Text>
      <Flex width="100%" justifyContent="center">
        <Spinner size="lg" color="primary" />
      </Flex>
      <Text variant="heading">My NFTs</Text>
      <Flex width="100%" justifyContent="center">
        <Spinner size="lg" color="primary" />
      </Flex>
    </Flex>
  )
)

export default BuyGallery
