import React from 'react'
import { Text as RebassText } from 'rebass'
import { FlexGrowProps } from 'styled-system'
import { LayoutProps, MarginProps } from 'types'

export type TextVariant =
  | 'heroTitle'
  | 'heroHeading'
  | 'xlTitle'
  | 'largeTitle'
  | 'title'
  | 'heading'
  | 'heading2'
  | 'bodyLarge'
  | 'body'
  | 'bodyMedium'
  | 'secondary'
  | 'secondaryMedium'
  | 'small'
  | 'smallMedium'
  | 'label'

export type TextColor =
  | 'body'
  | 'light'
  | 'label'
  | 'primary'
  | 'error'
  | 'warning'
  | 'disabled'
  | 'inherit'
  | 'inverted'

export type TextProps = {
  variant?: TextVariant
  children?: React.ReactNode
  color?: TextColor
  textAlign?: 'left' | 'right' | 'center'
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  onClick?: React.ReactEventHandler<HTMLElement>
} & LayoutProps &
  MarginProps &
  FlexGrowProps

export type TextElement = React.ReactElement<TextProps>

const getTextColor = (color: TextColor): string => {
  switch (color) {
    case 'body':
      return 'bodyText'
    case 'light':
      return 'lightText'
    case 'label':
      return 'secondaryText'
    case 'disabled':
      return 'disabledText'
    case 'inverted':
      return 'invertedText'
    case 'primary':
      return 'primaryText'
    default:
      return color
  }
}

const getDefaultAs = (variant?: TextVariant) => {
  switch (variant) {
    case 'largeTitle':
      return 'h1'
    case 'title':
      return 'h2'
    case 'heading':
      return 'h3'
    case 'heading2':
      return 'h4'
    default:
      return 'p'
  }
}

export default function Text({
  children,
  variant,
  as = getDefaultAs(variant),
  color = as === 'span' ? 'inherit' : 'body',
  onClick,
  ...styleProps
}: TextProps): TextElement {
  return (
    <RebassText
      {...styleProps}
      onClick={onClick}
      variant={variant}
      as={as}
      color={color ? getTextColor(color) : undefined}
    >
      {children}
    </RebassText>
  )
}
