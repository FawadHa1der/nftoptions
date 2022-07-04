import React from 'react'
import { Image } from 'rebass'

import { CustomIconProps } from './IconSVG'

export default function WalletLinkIcon({ size }: CustomIconProps) {
  return <Image width={size} height={size} src="/images/coinbaseWalletIcon.svg" />
}
