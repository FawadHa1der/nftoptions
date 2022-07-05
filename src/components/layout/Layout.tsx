import Box from 'components/common/Box'
import Flex from 'components/common/Flex'
import React from 'react'

import { Header } from '.'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box margin="0 auto" height="100%" maxWidth={1300} sx={{ transition: '0.25s ease-out' }}>
      <Flex p="8" flexDirection="column">
        <Header />
        <Box flex="1 1 auto" marginY={22}>
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default Layout
