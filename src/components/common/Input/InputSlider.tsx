import { Slider } from '@rebass/forms'
import React from 'react'

import { LayoutProps, MarginProps } from 'styled-system'
type Props = {
  value: number
  max: number
  min: number
  step?: number
  color?: string
  onChange: (value: number) => void
} & MarginProps &
  LayoutProps

export default function InputSlider({ value, max, min, step, onChange, color, ...styleProps }: Props) {
  return (
    <Slider
      value={value}
      max={max}
      min={min}
      step={step}
      onChange={e => onChange(parseFloat(e.target.value))}
      sx={{ ':focus': { color } }}
      {...styleProps}
    />
  )
}
