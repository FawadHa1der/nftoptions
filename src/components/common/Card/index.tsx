import Flex, { FlexProps } from 'components/common/Flex'
import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

export type CardVariant = 'default' | 'primary' | 'error'

export type CardProps = {
  children?: React.ReactNode
  variant?: CardVariant
  isSolid?: boolean
} & MarginProps &
  LayoutProps &
  FlexProps

export type CardElement = React.ReactElement<CardProps>

const getVariant = (variant: CardVariant): string => {
  switch (variant) {
    case 'default':
      return 'card'
    case 'primary':
      return 'cardPrimary'
    case 'error':
      return 'cardError'
  }
}

// eslint-disable-next-line react/display-name
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', isSolid, ...styleProps }: CardProps, ref): CardElement => {
    return (
      <Flex
        ref={ref}
        variant={getVariant(variant)}
        flexDirection="column"
        {...styleProps}
        bg={isSolid ? 'modalBackground' : undefined}
        sx={{ position: 'relative', ...(styleProps as any)?.sx }}
      >
        {/* CardSection or CardBody handle padding */}
        {children}
      </Flex>
    )
  }
)

export default Card
