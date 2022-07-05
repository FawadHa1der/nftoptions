import React, { useMemo } from 'react'
import { Text as RebassText } from 'rebass'
import { MarginProps } from 'styled-system'
import getVariantSX from 'utils/getVariantSX'

export type TokenVariant = 'default' | 'primary' | 'error' | 'warning'

export type TokenProps = {
  label?: string | null
  variant?: TokenVariant
} & MarginProps

const getTokenVariant = (variant: TokenVariant): string => {
  switch (variant) {
    case 'default':
      return 'variants.tokenDefault'
    case 'primary':
      return 'variants.tokenPrimary'
    case 'error':
      return 'variants.tokenError'
    case 'warning':
      return 'variants.tokenWarning'
  }
}

export default function Token({ label, variant = 'default', ...marginProps }: TokenProps) {
  const sx = useMemo(() => {
    return getVariantSX(getTokenVariant(variant))
  }, [variant])
  return (
    <RebassText as="p" sx={sx} {...marginProps}>
      {label}
    </RebassText>
  )
}
