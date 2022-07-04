import useFontSize from 'hooks/useFontSize'
import useLineHeight from 'hooks/useLineHeight'
import getVariantSX from 'utils/getVariantSX'
import isExternalURL from 'utils/isExternalURL'
import React from 'react'
import { Link as RebassLink } from 'rebass'

import { IconType } from '../Icon'
import IconSVG from '../Icon/IconSVG'
import { TextProps } from '../Text'
import NextLink from './NextLink'

type Props = {
  href: string
  target?: string
  leftIcon?: IconType
  children?: React.ReactNode
  showRightIcon?: boolean
} & TextProps

export default function Link({
  target,
  href,
  children,
  leftIcon,
  showRightIcon,
  variant = 'body',
  ...props
}: Props): JSX.Element | null {
  const fontSize = Math.floor(useFontSize(variant) * 0.8) // Apply some buffer to center icon
  const lineHeightSize = Math.floor(useLineHeight(variant) * 0.8) // Apply some buffer to center icon
  const textSx = getVariantSX('text.' + variant)
  if (isNaN(fontSize)) {
    console.warn('lineHeight / fontSize does not exist for variant')
    return null
  }
  return (
    <NextLink href={href}>
      <RebassLink variant="textLink" href={href} target={target} {...props} sx={textSx}>
        {leftIcon ? (
          <>
            <IconSVG strokeWidth={3} size={lineHeightSize} icon={leftIcon} />
            &nbsp;&nbsp;
          </>
        ) : null}
        {children}
        {showRightIcon ? (
          <>
            &nbsp;
            <IconSVG
              strokeWidth={3}
              size={fontSize}
              icon={isExternalURL(href) || target === '_blank' ? IconType.ArrowUpRight : IconType.ArrowRight}
            />
          </>
        ) : null}
      </RebassLink>
    </NextLink>
  )
}
