import { Checkbox as RebassCheckbox } from '@rebass/forms'
import React from 'react'
import { MarginProps, PaddingProps } from 'styled-system'

type Props = {
  checked: boolean
  onToggle: (checked: boolean) => void
} & PaddingProps &
  MarginProps

export default function Checkbox({ checked, onToggle, ...styleProps }: Props) {
  return (
    <RebassCheckbox
      sx={{
        cursor: 'pointer',
      }}
      onChange={e => onToggle(e.currentTarget.checked)}
      checked={checked}
      {...styleProps}
    />
  )
}
