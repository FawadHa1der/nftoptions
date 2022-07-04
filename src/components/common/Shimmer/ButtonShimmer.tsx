import getVariantSX from 'utils/getVariantSX'
import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import { ButtonSize, getButtonSizeVariant } from '../Button'
import Shimmer from '.'

type Props = {
  size?: ButtonSize
} & MarginProps &
  Omit<LayoutProps, 'height' | 'h'>

export default function ButtonShimmer({ size = 'md', width = 100, ...styleProps }: Props) {
  const sizeVariant = getButtonSizeVariant(size)
  const sx = getVariantSX(sizeVariant)
  const buttonHeight = sx?.height
  const borderRadius = sx?.borderRadius
  return <Shimmer height={buttonHeight} width={width} borderRadius={borderRadius} {...styleProps} />
}
