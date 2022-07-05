import { Spacer } from '@chakra-ui/react'
import Alert from 'components/common/Alert'
import Button from 'components/common/Button'
import Card from 'components/common/Card'
import CardBody from 'components/common/Card/CardBody'
import Flex from 'components/common/Flex'
import GalleryCard from 'components/common/GalleryCard'
import Grid from 'components/common/Grid'
import ButtonShimmer from 'components/common/Shimmer/ButtonShimmer'
import Spinner from 'components/common/Spinner'
import Text from 'components/common/Text'
import { getStarknet } from 'get-starknet'
import { NFTData } from 'hooks/useMyNFTs'
import useMyShortPuts from 'hooks/useMyShortPuts'
import usePuts, { PutDataWithNFT } from 'hooks/usePuts'
import withSuspense from 'hooks/withSuspense'
import { ACTION_CARD_WIDTH } from 'pages'
import React, { useState } from 'react'
import { sendTransaction } from 'utils/blockchain/starknet'
import { sellPut } from './transactions'



const SellGallery = withSuspense(
  () => {
    const puts = usePuts();
    console.log('puts', puts);
    const myPuts = useMyShortPuts();
    const [selectedPut, setSelectedPut] = useState<PutDataWithNFT | null>(null)
    const handleClickNFT = (nftData: NFTData, option: any) => {
      if (selectedPut?.nftData.token_id === nftData.token_id) {
        setSelectedPut(null)
      } else {
        console.log('selectedPut', selectedPut);
        setSelectedPut(nftData && option)
      }
    }

    const onClickSell = () => {
      console.log('selectedPut', selectedPut);
      if (selectedPut) {
        console.log('selected put', selectedPut);
        sellPut(selectedPut);
      }
    }

    return (
      <Flex flexDirection="column" width="100%">
        <Grid>
          <Text variant="heading">My Puts</Text>
          {myPuts.map(put => (
            <GalleryCard key={put.bid_id} nftData={put.nftData} option={put} />
          ))}
        </Grid>
        <Text variant="heading">Offers</Text>
        <Grid
          width="100%"
          sx={{ gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`, columnGap: 6, rowGap: 6 }}
        >
          {puts.map(put => (
            <GalleryCard key={put.bid_id} nftData={put.nftData} option={put} onClick={handleClickNFT} />
          ))}
        </Grid>
        {selectedPut ? (
          <Card mt={50} ml={6} minWidth={ACTION_CARD_WIDTH}>
            <CardBody>
              <Flex width="100%" flexDirection="column" justifyContent="center" alignItems="center">
                <Text variant="heading">Sell PUT for</Text>
                <Text variant="heading"> {selectedPut.nftData.name}</Text>
              </Flex>
              <Flex flexDirection="column">
                <Flex>
                  <Text variant='label'>Strike</Text>
                  <Text ml="auto" variant='label'>{selectedPut.strike_price}</Text>
                </Flex>
                <Flex alignItems="center">
                  <Text variant='label'>Expiry</Text>
                  <Text ml="auto" variant='label'>{selectedPut.expiry_date}</Text>
                </Flex>
                <Flex alignContent="center">
                  <Text variant='label'>premium</Text>
                  <Text ml="auto" variant='label'>{selectedPut.premium}</Text>
                </Flex>
                <Flex>
                  <Text variant='label'>balance</Text>
                  <Text ml="auto" variant='label'>{0} ETH</Text>
                </Flex>
              </Flex>
              <Button label='Sell Put' variant='primary' size='large' onClick={onClickSell}>
              </Button>
            </CardBody>
          </Card>
        ) : null}
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
