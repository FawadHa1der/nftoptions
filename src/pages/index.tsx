import ToggleButton from 'components/common/Button/ToggleButton'
import CardBody from 'components/common/Card/CardBody'
import Flex from 'components/common/Flex'
import BuyGallery from 'containers/BuyGallery'
import SellGallery from 'containers/SellGallery'
import React, { useState } from 'react'
import { Card } from 'rebass'

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('buy')
  return (
    <Flex mb={8} width="100%" height="100%" flexDirection="column">
      <Card>
        <CardBody>
          <ToggleButton
            width={250}
            selectedItemId={selectedTab}
            onChange={id => setSelectedTab(id)}
            items={[
              { id: 'buy', label: 'Buy PUTs' },
              { id: 'sell', label: 'Sell PUTs' },
            ]}
          />
          <Flex mt={4}>{selectedTab === 'buy' ? <BuyGallery /> : <SellGallery />}</Flex>
        </CardBody>
      </Card>
    </Flex>
  )
}

export default Home
