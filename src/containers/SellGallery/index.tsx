import Box from 'components/common/Box'
import Text from 'components/common/Text'
import withSuspense from 'hooks/withSuspense'
import React from 'react'

const SellGallery = withSuspense(() => {
  return (
    <>
      <Box>
        <Text variant="heading">My Puts</Text>
        <Text variant="heading">Offers</Text>
      </Box>
    </>
  )
})

export default SellGallery
