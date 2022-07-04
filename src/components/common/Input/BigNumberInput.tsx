import { BigNumber } from '@ethersproject/bignumber'
import emptyFunction from 'utils/emptyFunction'
import formatNumber from 'utils/formatNumber'
import fromBigNumber from 'utils/fromBigNumber'
import { BigNumberInput as BigNumberInputRaw } from 'big-number-input'
import React, { useCallback, useEffect, useState } from 'react'

import Input, { InputProps } from '.'

const MAX_BN = BigNumber.from(2).pow(256).sub(1)
const ZERO_BN = BigNumber.from(0)

export type Props = {
  value: BigNumber
  placeholder?: BigNumber | string
  onChange: (value: BigNumber) => void
  min?: BigNumber
  max?: BigNumber
  customMaxMessage?: string
  customMinMessage?: string
  decimals?: number
  // onEmpty handler takes priority over "defaultValue"
  onEmpty?: () => void
  defaultValue?: BigNumber
} & Omit<InputProps, 'placeholder' | 'value' | 'onChange' | 'type' | 'error' | 'onError'>

export default function BigNumberInput({
  value,
  onChange,
  min,
  max,
  decimals = 18,
  placeholder = ZERO_BN,
  onBlur = emptyFunction,
  onFocus = emptyFunction,
  customMaxMessage,
  customMinMessage,
  autoFocus,
  defaultValue = ZERO_BN,
  onEmpty,
  ...inputProps
}: Props): JSX.Element {
  const [error, setError] = useState<string | false>(false)

  const checkError = useCallback(
    (value: BigNumber) => {
      if (max != null && value.gt(max)) {
        setError(customMaxMessage ?? 'Input is too large')
      } else if (min != null && value.lt(min)) {
        setError(customMinMessage ?? 'Input is too small')
      } else {
        setError(false)
      }
    },
    [setError, customMaxMessage, customMinMessage, max, min]
  )

  useEffect(() => {
    // Check for any dynamic value updates
    checkError(value)
  }, [value, checkError])

  const placeholderStr = BigNumber.isBigNumber(placeholder)
    ? formatNumber(fromBigNumber(placeholder, decimals), 1)
    : placeholder

  return (
    <BigNumberInputRaw
      decimals={decimals}
      value={value?.toString() ?? ''}
      onChange={value => {
        if (value) {
          const bn = BigNumber.from(value)
          onChange(bn)
          checkError(bn)
        } else {
          if (onEmpty) {
            onEmpty()
            return
          }
          onChange(defaultValue)
          checkError(defaultValue)
        }
      }}
      placeholder={placeholderStr}
      max={MAX_BN.toString()}
      min={ZERO_BN.toString()}
      autofocus={autoFocus}
      renderInput={({ value: rawValue, placeholder, onChange }) => {
        return (
          <Input
            {...inputProps}
            value={rawValue}
            placeholder={placeholder}
            onChange={onChange ?? emptyFunction}
            autoFocus={autoFocus}
            type="text"
            onFocus={e => {
              onFocus(e)
              checkError(value)
            }}
            onBlur={e => {
              onBlur(e)
              checkError(value)
            }}
            error={error}
          />
        )
      }}
    />
  )
}
