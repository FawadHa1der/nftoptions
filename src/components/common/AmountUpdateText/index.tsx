import Text, { TextElement, TextProps } from 'components/common/Text'
import React from 'react'
import formatNumber from 'utils/formatNumber'
import formatUSD from 'utils/formatUSD'

type Props = {
  prevAmount: number
  newAmount: number
  isUSDFormat?: boolean
  symbol?: string
} & TextProps

const AmountUpdateText = ({ prevAmount, newAmount, symbol, isUSDFormat, color, ...textProps }: Props): TextElement => {
  return (
    <Text color={color} {...textProps}>
      <Text
        as="span"
        sx={{
          textDecoration: prevAmount > 0 && prevAmount !== newAmount ? 'line-through' : 'auto',
          color,
        }}
      >
        {isUSDFormat ? formatUSD(prevAmount) : formatNumber(prevAmount)}
      </Text>
      {newAmount > 0 && prevAmount !== newAmount ? (
        <Text as="span">
          &nbsp;→&nbsp;
          <Text as="span">
            {isUSDFormat ? formatUSD(newAmount < 0 ? 0 : newAmount) : formatNumber(newAmount < 0 ? 0 : newAmount)}
          </Text>
        </Text>
      ) : null}
      &nbsp;{symbol}
    </Text>
  )
}

export default AmountUpdateText
