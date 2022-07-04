import useThemeColor from 'hooks/ui/useThemeColor'
import React from 'react'
import styled from 'styled-components'
import { MarginProps } from 'types'

import Box from '../Box'

export type SpinnerSize = 'xs' | 'xsmall' | 'sm' | 'small' | 'md' | 'medium' | 'lg' | 'large' | 'xl' | 'xlarge'

type Props = {
  size?: SpinnerSize
  color?: string
} & MarginProps

export const getSpinnerWidth = (size: SpinnerSize): number => {
  switch (size) {
    case 'xs':
    case 'xsmall':
      return 18
    case 'sm':
    case 'small':
      return 24
    case 'md':
    case 'medium':
      return 32
    case 'lg':
    case 'large':
      return 48
    case 'xl':
    case 'xlarge':
      return 64
  }
}

export const getSpinnerStrokeWidth = (size: SpinnerSize): number => {
  switch (size) {
    case 'xs':
    case 'xsmall':
    case 'sm':
    case 'small':
      return 1
    case 'md':
    case 'medium':
      return 2
    case 'xl':
    case 'xlarge':
    case 'lg':
    case 'large':
      return 3
  }
}

function SpinnerRaw({ size = 'lg', color = 'primary', ...styleProps }: Props) {
  const trueSize = getSpinnerWidth(size)
  const strokeWidth = getSpinnerStrokeWidth(size)
  const strokeColor = useThemeColor(color)
  // 20% opacity
  const strokeBg = strokeColor + '33'
  return (
    <Box
      {...styleProps}
      width={trueSize}
      height={trueSize}
      sx={{
        borderRadius: 'circle',
        borderColor: strokeColor,
        borderWidth: strokeWidth,
        borderStyle: 'solid',
        borderBottomColor: strokeBg,
        borderLeftColor: strokeBg,
        borderRightColor: strokeBg,
        animation: 'spinner 1s linear infinite',
      }}
    />
  )
}

const Spinner = styled(SpinnerRaw)`
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export default Spinner
