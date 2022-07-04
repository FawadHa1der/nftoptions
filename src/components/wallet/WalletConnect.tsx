//import { useStarknet } from "@starknet-react/core";
import Button from 'components/common/Button'
import { IconType } from 'components/common/Icon'
import { getStarknet } from 'get-starknet'
import React, { useState } from 'react'

const WalletConnect = () => {
  const [argentAccount, setArgentAccount] = useState('')
  const enable = async () => {
    const [userWalletContractAddress] = await getStarknet().enable()
    if (getStarknet().isConnected === true) {
      console.log('connected with ', getStarknet().account.address)
      setArgentAccount(getStarknet().account.address)
    } else {
      // throw Error("starknet wallet not connected")
    }
  }

  async function enableArgentX() {
    // Check if wallet extension is installed and initialized.
    console.log('trying t o connect')
    // May throw when no extension is detected, otherwise shows a modal prompting the user to download Argent X.
    const [userWalletContractAddress] = await getStarknet().enable({ showModal: true })
    // checks that enable succeeded
    if (getStarknet().isConnected === false) {
      //  throw Error("starknet wallet not connected")
    } else {
      console.log('show modal connected with ', getStarknet().account.address)
      setArgentAccount(getStarknet().account.address)
    }
  }

  //  enable()
  if (getStarknet().isConnected === false) {
    console.log('yep its not enabled')
  } else {
    console.log('yep its enabled now')
  }
  return getStarknet().isConnected === false ? (
    argentAccount ? (
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
      label={
        argentAccount
          ? `${argentAccount.substring(0, 4)}...${argentAccount.substring(argentAccount.length - 4)}`
          : 'No Account'
      }
    />
  )
}

export default WalletConnect
