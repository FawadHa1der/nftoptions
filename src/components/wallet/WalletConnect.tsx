//import { useStarknet } from "@starknet-react/core";
import Button from 'components/common/Button'
import { IconType } from 'components/common/Icon'
import ButtonShimmer from 'components/common/Shimmer/ButtonShimmer'
import { getStarknet } from 'get-starknet'
import useWallet from 'hooks/useWallet'
import withSuspense from 'hooks/withSuspense'
import React, { useState } from 'react'
import formatTruncatedAddress from 'utils/formatTruncatedAddress'

const WalletConnect = withSuspense(
  () => {
    const [argentAccount, setArgentAccount] = useState('')
    const address = useWallet()

    async function enableArgentX() {
      // Check if wallet extension is installed and initialized.
      // May throw when no extension is detected, otherwise shows a modal prompting the user to download Argent X.
      // checks that enable succeeded
      if (getStarknet().isConnected === false) {
        //  throw Error("starknet wallet not connected")
      } else {
        console.log('show modal connected with ', getStarknet().account.address)
        setArgentAccount(getStarknet().account.address)
      }
    }

    return getStarknet().isConnected === false ? (
      address ? (
        <Button ml={2} variant="primary" href="https://github.com/argentlabs/argent-x" label="Get Argent X" />
      ) : (
        <Button
          ml={2}
          variant="primary"
          onClick={() => {
            enableArgentX()
          }}
          label="Connect Wallet"
        />
      )
    ) : (
      <Button
        ml={2}
        leftIcon={IconType.ArgentX}
        // HACK: refresh to disconnect
        // TODO: actually disconnect when supported in starknet-react
        onClick={() => {
          window.location.reload()
        }}
        label={address ? `${formatTruncatedAddress(address)}` : 'No Account'}
      />
    )
  },
  () => <ButtonShimmer ml={2} />
)

export default WalletConnect
