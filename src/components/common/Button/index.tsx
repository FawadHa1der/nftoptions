import React, { useMemo } from 'react'
import { Button as RebassButton } from 'rebass'
import { LayoutProps, MarginProps, PaddingProps } from 'styled-system'
import mergeVariantSX from 'utils/mergeVariantSX'

import Center from '../Center'
import Flex from '../Flex'
import IconOrImage from '../Icon/IconOrImage'
import { IconType } from '../Icon/IconSVG'
import NextLink from '../Link/NextLink'
import Spinner, { SpinnerSize } from '../Spinner'
import Text, { TextVariant } from '../Text'

export type ButtonSize = 'sm' | 'small' | 'md' | 'medium' | 'lg' | 'large' | 'xl'

export type ButtonVariant = 'default' | 'primary' | 'error' | 'light' | 'warning' | 'white'

export type BaseButtonProps = {
  size?: ButtonSize
  target?: string
  href?: string
  variant?: ButtonVariant
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  isOutline?: boolean
  isDisabled?: boolean
  isTransparent?: boolean
  type?: string
  textVariant?: TextVariant
}

export type ButtonProps = {
  label: string
  leftIcon?: IconType | React.ReactNode
  rightIcon?: IconType | React.ReactNode
  leftIconSpacing?: number
  rightIconSpacing?: number
  isLoading?: boolean
} & BaseButtonProps &
  PaddingProps &
  Omit<MarginProps & LayoutProps, 'height' | 'h' | 'size'>

export type ButtonElement = React.ReactElement<ButtonProps>

export const getButtonSizeVariant = (size: ButtonSize): string => {
  switch (size) {
    case 'small':
    case 'sm':
      return 'buttons.small'
    case 'medium':
    case 'md':
      return 'buttons.medium'
    case 'large':
    case 'lg':
      return 'buttons.large'
    case 'xl':
      return 'buttons.xl'
  }
}

export const getButtonStyleVariant = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
      return 'buttons.primary'
    case 'error':
      return 'buttons.error'
    case 'default':
      return 'buttons.default'
    case 'light':
      return 'buttons.light'
    case 'warning':
      return 'buttons.warning'
    case 'white':
      return 'buttons.white'
  }
}

export const getButtonIconSize = (size: ButtonSize): string => {
  switch (size) {
    case 'small':
    case 'sm':
      return '14px'
    case 'medium':
    case 'md':
      return '16px'
    case 'large':
    case 'lg':
    case 'xl':
      return '18px'
  }
}

const getSpinnerSize = (size: ButtonSize): SpinnerSize => {
  switch (size) {
    case 'small':
    case 'sm':
    case 'medium':
    case 'md':
      return 'xs'
    case 'large':
    case 'lg':
    case 'xl':
      return 'sm'
  }
}

export const getButtonSX = (
  variant: ButtonVariant,
  size: ButtonSize,
  isOutline?: boolean,
  isTransparent?: boolean,
  isDisabled?: boolean
): any => {
  const sizeVariant = getButtonSizeVariant(size)
  const styleVariant = isDisabled
    ? 'buttons.disabled'
    : getButtonStyleVariant(variant) + (isOutline ? 'Outline' : isTransparent ? 'Transparent' : '')
  return mergeVariantSX(sizeVariant, styleVariant)
}

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(
  (
    {
      label,
      onClick,
      href,
      target,
      type,
      variant = 'default',
      size = 'medium',
      isOutline,
      isTransparent,
      isDisabled,
      isLoading,
      leftIcon,
      leftIconSpacing,
      rightIcon,
      rightIconSpacing,
      textVariant,
      ...styleProps
    }: ButtonProps,
    ref
  ): ButtonElement => {
    const sx = useMemo(
      () => getButtonSX(variant, size, isOutline, isTransparent, isDisabled),
      [size, variant, isOutline, isDisabled, isTransparent]
    )

    // HACK: Ensure fontSize in theme always refers to direct value
    const iconSize = getButtonIconSize(size)
    const left =
      leftIcon || isLoading ? (
        <Flex justifyContent={'flex-start'} pr={2} flexGrow={leftIconSpacing}>
          {leftIcon ? (
            typeof leftIcon === 'string' ? (
              <IconOrImage src={leftIcon} size={iconSize} />
            ) : (
              <Center>{leftIcon}</Center>
            )
          ) : (
            <Spinner size={getSpinnerSize(size)} color={sx.color} />
          )}
        </Flex>
      ) : null

    const right = rightIcon ? (
      <Flex justifyContent={'flex-end'} flexGrow={rightIconSpacing} pl={2}>
        {typeof rightIcon === 'string' ? <IconOrImage src={rightIcon} size={iconSize} /> : rightIcon}
      </Flex>
    ) : null

    return (
      <NextLink href={href}>
        <RebassButton
          ref={ref}
          as={href != null ? 'a' : 'button'}
          href={href}
          target={target}
          display="flex"
          alignItems="center"
          type={type}
          justifyContent="center"
          className={isDisabled || isLoading ? 'disabled' : undefined}
          onClick={!isDisabled && !isLoading ? onClick : undefined}
          {...styleProps}
          sx={{
            ...sx,
            cursor: isDisabled ? 'not-allowed' : isLoading ? 'default' : 'pointer',
          }}
          opacity={isLoading ? 0.65 : 1.0}
        >
          {left}
          {textVariant ? (
            <Text color="inherit" variant={textVariant}>
              {label}
            </Text>
          ) : (
            label
          )}
          {right}
        </RebassButton>
      </NextLink>
    )
  }
)

export default Button
