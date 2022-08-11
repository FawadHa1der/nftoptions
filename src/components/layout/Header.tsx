import IconButton from 'components/common/Button/IconButton'
import Flex from 'components/common/Flex'
import { IconType } from 'components/common/Icon'
import Image from 'components/common/Image'
import Text from 'components/common/Text'
import Tour from 'components/Tour'
import { WalletConnect } from 'components/wallet'
import useIsDarkMode from 'hooks/ui/useIsDarkMode'
import React from 'react'
import getAssetSrc from 'utils/getAssetSrc'

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useIsDarkMode()
  return (
    <Flex pt={4}>
      <Flex alignItems="center">
        <Image mr={2} src={getAssetSrc('images/logo.png')} size={32}></Image>
        <Text variant="largeTitle">Lyra NFT</Text>
      </Flex>
      <Flex ml="auto">
        <Tour />
        <IconButton onClick={() => setIsDarkMode(!isDarkMode)} icon={isDarkMode ? IconType.Sun : IconType.Moon} />
        <WalletConnect />
      </Flex>
    </Flex>
  )
}

export default Header
