import Image from 'components/common/Image'
import React from 'react'
import { MarginProps } from 'types'
import coerce from 'utils/coerce'

import Icon from '.'
import { IconType, SVGIconProps } from './IconSVG'

type Props = {
  src?: IconType | string
} & Omit<SVGIconProps, 'icon'> &
  MarginProps

export default function IconOrImage({ src, size, ...props }: Props) {
  const iconType = coerce(IconType, src)
  return iconType ? (
    <Icon icon={iconType} size={size} {...props} />
  ) : (
    <Image src={src} width={size} height={size} {...props} />
  )
}
