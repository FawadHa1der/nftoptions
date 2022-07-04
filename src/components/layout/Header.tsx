import IconButton from 'components/common/Button/IconButton'
import Flex from 'components/common/Flex'
import { IconType } from 'components/common/Icon'
import Text from 'components/common/Text'
import { WalletConnect } from 'components/wallet'
import useIsDarkMode from 'hooks/ui/useIsDarkMode'
import React from 'react'

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useIsDarkMode()
  return (
    <Flex pt={4}>
      <Text variant="title">Lyra NFT</Text>
      <Flex ml="auto">
        <IconButton onClick={() => setIsDarkMode(!isDarkMode)} icon={isDarkMode ? IconType.Sun : IconType.Moon} />
        <WalletConnect />
      </Flex>
    </Flex>
  )
}

export default Header
