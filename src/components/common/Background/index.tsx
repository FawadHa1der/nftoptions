import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import Box from '../Box'

type Props = { backgroundColor?: string; bloomTop?: string; bloomLeft?: string } & MarginProps & LayoutProps

export default function Background({
  backgroundColor = 'background',
  bloomTop: top = '-5%',
  bloomLeft: left = '-25%',
  ...styleProps
}: Props): JSX.Element {
  return (
    <Box {...styleProps} overflow="visible" width="100vw" height="100vh" backgroundColor={backgroundColor}>
      <Box
        width="100%"
        height="100%"
        sx={{
          position: 'absolute',
          top,
          left,
          background:
            'radial-gradient(circle, rgba(126,167,205,0.35) 0%, rgba(120,183,200,0.25) 15%, rgba(106,196,191,0.1) 31%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%)',
          opacity: 0.35,
        }}
      />
    </Box>
  )
}
