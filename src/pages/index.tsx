import ToggleButton from 'components/common/Button/ToggleButton'
import Flex from 'components/common/Flex'
import BuyGallery from 'containers/BuyGallery'
import SellGallery from 'containers/SellGallery'
import React, { useState } from 'react'

export const ACTION_CARD_WIDTH = 340

const Home = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState('buy')
  return (
    <Flex flexGrow={1} height="100%" flexDirection="column" mt={8}>
      <ToggleButton
        width={250}
        selectedItemId={selectedTab}
        onChange={id => setSelectedTab(id)}
        items={[
          { id: 'buy', label: 'Buy PUTs' },
          { id: 'sell', label: 'Sell PUTs' },
        ]}
      />
      <Flex mt={6}>{selectedTab === 'buy' ? <BuyGallery /> : <SellGallery />}</Flex>
    </Flex>
  )
}

export default Home
