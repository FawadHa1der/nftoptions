import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import Box from '../Box'
import Flex from '../Flex'
import { IconType } from '../Icon'
import IconOrImage from '../Icon/IconOrImage'
import Text from '../Text'

export type AlertVariant = 'default' | 'info' | 'primary' | 'error' | 'warning'

type Props = {
  variant?: AlertVariant
  label: string | React.ReactNode
  icon?: IconType | React.ReactNode
  sublabel?: string | React.ReactNode
  hrefLabel?: string
  href?: string
  textAlign?: 'left' | 'center' | 'right'
  target?: string
} & MarginProps &
  LayoutProps

const getVariant = (variant: AlertVariant): string => {
  switch (variant) {
    case 'error':
      return 'variants.alertError'
    case 'default':
    case 'info':
      return 'variants.alertInfo'
    case 'primary':
      return 'variants.alertPrimary'
    case 'warning':
      return 'variants.alertWarning'
  }
}

export default function Alert({
  variant = 'default',
  label,
  sublabel,
  icon,
  hrefLabel,
  href,
  target,
  textAlign,
  ...styleProps
}: Props) {
  return (
    <Flex {...styleProps} variant={getVariant(variant)} flexDirection="column">
      <Flex>
        {icon ? (
          <Box mr={2} minWidth={14} mt={'4px'}>
            {typeof icon === 'string' ? <IconOrImage size={14} src={icon} /> : icon}
          </Box>
        ) : null}
        <Box width="100%" textAlign={textAlign}>
          {typeof label === 'string' ? (
            <Text variant="secondary" color="inherit">
              {label}
            </Text>
          ) : (
            label
          )}
          {sublabel ? (
            <Text mt={1} color="inherit" variant="secondary">
              {sublabel}
            </Text>
          ) : null}
        </Box>
      </Flex>
    </Flex>
  )
}
