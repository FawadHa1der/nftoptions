import ToggleButton from 'components/common/Button/ToggleButton'
import Card from 'components/common/Card'
import CardBody from 'components/common/Card/CardBody'
import Flex from 'components/common/Flex'
import Text from 'components/common/Text'
import BuyGallery from 'containers/BuyGallery'
import SellGallery from 'containers/SellGallery'
import React, { useState } from 'react'

export const ACTION_CARD_WIDTH = 340

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('buy')

  return (
    <Flex>
      <Flex flexGrow={1} height="100%" flexDirection="column">
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
      </Flex>
      {selectedTab === 'buy' ? (
        <Card ml={6} width={ACTION_CARD_WIDTH}>
          <CardBody>
            <Text variant="heading">Buy PUT for $NAME</Text>
          </CardBody>
        </Card>
      ) : null}
    </Flex>
  )
}

export default Home
