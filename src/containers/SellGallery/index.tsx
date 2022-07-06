import Box from 'components/common/Box'
import Flex from 'components/common/Flex'
import GalleryCard from 'components/common/GalleryCard'
import Grid from 'components/common/Grid'
import Spinner from 'components/common/Spinner'
import Text from 'components/common/Text'
import SellCard from 'components/sell_gallery/SellCard'
import { NFTData } from 'hooks/useMyNFTs'
import useMyShortPuts from 'hooks/useMyShortPuts'
import usePuts, { PutDataWithNFT } from 'hooks/usePuts'
import withSuspense from 'hooks/withSuspense'
import React, { useState } from 'react'

const SellGallery = withSuspense(
  () => {
    const [puts, mutatePuts] = usePuts()
    const [myPuts, mutateMyShortPuts] = useMyShortPuts()
    const [selectedOpenPut, setSelectedOpenPut] = useState<PutDataWithNFT | null>(null)

    const handleClickNFT = (nftData: NFTData, option: any) => {
      if (selectedOpenPut?.nftData.token_id === nftData.token_id) {
        setSelectedOpenPut(null)
      } else {
        setSelectedOpenPut(nftData && option)
      }
    }

    return (
      <Flex width="100%">
        <Box flexGrow={1} mr={6}>
          {myPuts.length > 0 ? (
            <Box mb={8}>
              <Text mb={4} variant="heading">
                My Puts
              </Text>
              <Grid
                width="100%"
                sx={{ gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`, columnGap: 6, rowGap: 6 }}
              >
                {myPuts.map(put => (
                  <GalleryCard key={put.bid_id} nftData={put.nftData} option={put} />
                ))}
              </Grid>
            </Box>
          ) : null}
          <Box width="100%">
            <Text mb={4} variant="heading">
              Offers
            </Text>
            <Grid
              width="100%"
              sx={{ gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`, columnGap: 6, rowGap: 6 }}
            >
              {puts.map(put => (
                <GalleryCard
                  key={put.bid_id}
                  nftData={put.nftData}
                  option={put}
                  isSelected={selectedOpenPut?.bid_id === put.bid_id}
                  onClick={handleClickNFT}
                />
              ))}
            </Grid>
          </Box>
        </Box>
        <SellCard
          mt={50}
          put={selectedOpenPut}
          onTransact={() => {
            mutatePuts()
            mutateMyShortPuts()
          }}
        />
      </Flex>
    )
  },
  () => (
    <Flex height={300} flexDirection="column" width="100%" justifyContent="center" alignItems="center">
      <Spinner size="lg" color="primary" />
    </Flex>
  )
)

export default SellGallery
