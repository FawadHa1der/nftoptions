import { Input as RebassInput } from '@rebass/forms'
import React, { ChangeEventHandler, FocusEventHandler, useEffect, useState } from 'react'
import { FlexGrowProps, LayoutProps, MarginProps } from 'styled-system'

import Box from '../Box'
import Flex from '../Flex'
import Text from '../Text'

export type HTMLInputProps = {
  value: string | number | readonly string[] | undefined
  placeholder?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  autoFocus?: boolean
  type?: string
}

export type InputProps = {
  variant?: string
  label?: string
  error?: false | string
  onError?: (error: false | string | null) => void
  rightContent?: React.ReactNode
  icon?: React.ReactNode
  isDisabled?: boolean
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent'
} & HTMLInputProps &
  MarginProps &
  LayoutProps &
  FlexGrowProps

export type InputElement = React.ReactElement<InputProps>

export default function Input({
  label,
  rightContent,
  icon,
  error,
  onError,
  value,
  onChange,
  placeholder,
  autoFocus,
  type,
  onBlur,
  onFocus,
  isDisabled,
  textAlign,
  ...styleProps
}: InputProps): InputElement {
  const [_isFocused, setIsFocused] = useState(false)
  const handleBlur: FocusEventHandler<HTMLInputElement> = e => {
    setIsFocused(false)
    if (onBlur != null) {
      onBlur(e)
    }
  }
  const handleFocus: FocusEventHandler<HTMLInputElement> = e => {
    setIsFocused(true)
    if (onFocus != null) {
      onFocus(e)
    }
  }
  useEffect(() => {
    if (onError) {
      onError(error ?? null)
    }
  }, [error, onError])
  return (
    <Box {...styleProps} sx={{ position: 'relative' }}>
      {label != null && (
        <Text mx={2} mb={1} variant="label" color={error ? 'error' : 'label'}>
          {label}
        </Text>
      )}
      <Flex
        alignItems="center"
        variant="inputContainer"
        sx={{
          bg: _isFocused ? 'buttonBackground' : undefined,
          borderColor: error ? 'errorDark' : _isFocused && !!value ? 'outline' : undefined,
          cursor: isDisabled ? 'not-allowed' : 'text',
        }}
      >
        {icon != null && (
          <Flex alignItems="center" pl={2}>
            {typeof icon === 'string' ? <Text variant="secondary">{icon}</Text> : icon}
          </Flex>
        )}
        <RebassInput
          onBlur={handleBlur}
          onFocus={handleFocus}
          flex={1}
          px={3}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          type={type}
          disabled={isDisabled}
          minHeight="35px"
          height="100%"
          sx={{ textAlign }}
        />
        {rightContent != null && (
          <Flex alignItems="center" mr={2}>
            {typeof rightContent === 'string' ? <Text variant="secondary">{rightContent}</Text> : rightContent}
          </Flex>
        )}
      </Flex>
    </Box>
  )
}
