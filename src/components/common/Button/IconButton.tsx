import React, { useMemo } from 'react'
import { Button as RebassButton } from 'rebass'
import { MarginProps } from 'styled-system'

import IconOrImage from '../Icon/IconOrImage'
import { IconType } from '../Icon/IconSVG'
import NextLink from '../Link/NextLink'
import { BaseButtonProps, getButtonIconSize, getButtonSX } from '.'

export type IconButtonProps = {
  icon: IconType | string | React.ReactNode
} & BaseButtonProps &
  MarginProps

// eslint-disable-next-line react/display-name
const IconButton = React.forwardRef(
  (
    {
      icon,
      onClick,
      href,
      target,
      type,
      variant = 'default',
      size = 'medium',
      isOutline,
      isDisabled,
      isTransparent,
      ...marginProps
    }: IconButtonProps,
    ref
  ) => {
    const sx = useMemo(
      () => getButtonSX(variant, size, isOutline, isTransparent, isDisabled),
      [size, variant, isOutline, isDisabled, isTransparent]
    )

    return (
      <NextLink href={href}>
        <RebassButton
          ref={ref}
          as={href != null ? 'a' : 'button'}
          disabled={isDisabled}
          onClick={onClick}
          href={href}
          target={target}
          type={type}
          display={'flex'}
          justifyContent="center"
          alignItems={'center'}
          {...marginProps}
          sx={sx}
          p={0}
          minWidth={sx.height}
        >
          {typeof icon === 'string' ? <IconOrImage src={icon} size={getButtonIconSize(size)} /> : icon}
        </RebassButton>
      </NextLink>
    )
  }
)

export default IconButton
