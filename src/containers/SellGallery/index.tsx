import Flex from 'components/common/Flex'
import GalleryCard from 'components/common/GalleryCard'
import Grid from 'components/common/Grid'
import Spinner from 'components/common/Spinner'
import Text from 'components/common/Text'
import usePuts from 'hooks/usePuts'
import withSuspense from 'hooks/withSuspense'
import React from 'react'

const SellGallery = withSuspense(
  () => {
    const puts = usePuts()
    return (
      <Flex flexDirection="column" width="100%">
        <Text variant="heading">My Puts</Text>
        <Text variant="heading">Offers</Text>
        <Grid
          width="100%"
          sx={{ gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`, columnGap: 6, rowGap: 6 }}
        >
          {puts.map(put => (
            <GalleryCard key={put.bid_id} nftData={put.nftData} option={put} />
          ))}
        </Grid>
      </Flex>
    )
  },
  () => (
    <Flex flexDirection="column" width="100%">
      <Text variant="heading">My Puts</Text>
      <Flex width="100%" justifyContent="center">
        <Spinner size="lg" color="primary" />
      </Flex>
      <Text variant="heading">Offers</Text>
      <Flex width="100%" justifyContent="center">
        <Spinner size="lg" color="primary" />
      </Flex>
    </Flex>
  )
)

export default SellGallery
