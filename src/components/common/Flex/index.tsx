import React from 'react'
import { Flex as RebassFlex } from 'rebass'
import { ColorProps, FlexboxProps, LayoutProps, MarginProps, PaddingProps } from 'styled-system'

import NextLink from '../Link/NextLink'

export type FlexProps = {
  children?: React.ReactNode
  onClick?: React.ReactEventHandler<HTMLDivElement>
  variant?: string
  id?: string
  className?: string
  href?: string
  target?: string
} & Omit<FlexboxProps & ColorProps & MarginProps & PaddingProps & LayoutProps, 'children'>

/* eslint-disable react/prop-types */
const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({ children, href, ...props }, ref) => {
  return (
    <NextLink href={href}>
      <RebassFlex {...props} as={href ? 'a' : 'div'} ref={ref}>
        {children}
      </RebassFlex>
    </NextLink>
  )
})

export default Flex
