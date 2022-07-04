import React from 'react'

import Flex, { FlexProps } from '../Flex'

export type CardSectionProps = {
  children: React.ReactNode
  noPadding?: boolean
  isHorizontal?: boolean
} & FlexProps

export type CardSectionElement = React.ReactElement<CardSectionProps>

export default function CardSection({
  children,
  noPadding,
  isHorizontal,
  ...styleProps
}: CardSectionProps): CardSectionElement {
  return (
    <Flex
      flexDirection="column"
      p={!noPadding ? 6 : 0}
      {...styleProps}
      sx={{
        borderBottom: !isHorizontal ? '3px solid' : undefined,
        borderBottomColor: !isHorizontal ? 'background' : undefined,
        borderRight: isHorizontal ? '3px solid' : undefined,
        borderRightColor: isHorizontal ? 'background' : undefined,
        ':last-of-type': {
          borderBottom: '0px solid transparent',
          borderRight: '0px solid transparent',
        },
        ...(styleProps as any).sx,
      }}
    >
      {children}
    </Flex>
  )
}
