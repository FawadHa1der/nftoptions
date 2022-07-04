import Link from 'next/link'

import { WalletConnect } from 'components/wallet'
import Flex from 'components/common/Flex'
import Text from 'components/common/Text'
import IconButton from 'components/common/Button/IconButton'
import useIsDarkMode from 'hooks/useIsDarkMode'
import { IconType } from 'components/common/Icon'

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
