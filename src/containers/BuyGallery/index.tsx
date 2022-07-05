import BuyCard from 'components/buy_gallery/BuyCard'
import Box from 'components/common/Box'
import Flex from 'components/common/Flex'
import GalleryCard from 'components/common/GalleryCard'
import Grid from 'components/common/Grid'
import Spinner from 'components/common/Spinner'
import Text from 'components/common/Text'
import useMyLongPuts from 'hooks/useMyLongPuts'
import useMyNFTs, { NFTData } from 'hooks/useMyNFTs'
import withSuspense from 'hooks/withSuspense'
import React, { useState } from 'react'

export const GALLERY_CARD_WIDTH = 240

const BuyGallery = withSuspense(
  () => {
    const [nfts, mutateMyNFTs] = useMyNFTs()
    const [myLongPuts, mutateMyLongPuts] = useMyLongPuts()
    const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null)

    const handleClickNFT = (nftData: NFTData) => {
      if (selectedNFT?.token_id === nftData.token_id) {
        setSelectedNFT(null)
      } else {
        setSelectedNFT(nftData)
      }
    }

    const onTransact = () => {
      mutateMyLongPuts()
      mutateMyNFTs()
    }

    return (
      <Flex width="100%">
        <Box flexGrow={1} mr={6}>
          {myLongPuts.length > 0 ? (
            <Box>
              <Text mb={4} variant="heading">
                My Puts
              </Text>
              <Grid
                width="100%"
                sx={{ gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`, columnGap: 6, rowGap: 6 }}
              >
                {myLongPuts.map(put => (
                  <GalleryCard key={put.bid_id} nftData={put.nftData} option={put} />
                ))}
              </Grid>
            </Box>
          ) : null}
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
        <BuyCard mt={50} nftData={selectedNFT} onTransact={onTransact} />
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
