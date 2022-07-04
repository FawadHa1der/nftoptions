import { MarginProps } from 'types'
import React from 'react'

import Center from '../Center'
import IconSVG, { SVGIconProps } from './IconSVG'
export { IconType } from './IconSVG'

type Props = SVGIconProps & MarginProps

export default function Icon({ icon, size, color, strokeWidth, ...marginProps }: Props) {
  return (
    <Center {...marginProps} width={size} height={size}>
      <IconSVG icon={icon} size={size} color={color} strokeWidth={strokeWidth} />
    </Center>
  )
}
