import Box from 'components/common/Box'
import Flex from 'components/common/Flex'
import Text from 'components/common/Text'
import withSuspense from 'hooks/withSuspense'
import React from 'react'

const BuyGallery = withSuspense(() => {
  return (
    <Flex>
      <Box>
        <Text variant="heading">My Puts</Text>
        <Text variant="heading">My NFTs</Text>
      </Box>
    </Flex>
  )
})

export default BuyGallery
