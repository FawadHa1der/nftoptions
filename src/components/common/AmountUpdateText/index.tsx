import Text, { TextElement, TextProps } from 'components/common/Text'
import { BigNumber } from 'ethers'
import React from 'react'
import formatNumber from 'utils/formatNumber'
import formatUSD from 'utils/formatUSD'

type Props = {
  prevAmount: BigNumber
  newAmount: BigNumber
  isUSDFormat?: boolean
  symbol?: string
} & TextProps

const AmountUpdateText = ({ prevAmount, newAmount, symbol, isUSDFormat, color, ...textProps }: Props): TextElement => {
  return (
    <Text color={color} {...textProps}>
      <Text
        as="span"
        sx={{
          textDecoration: prevAmount.gt(0) && !prevAmount.eq(newAmount) ? 'line-through' : 'auto',
          color,
        }}
      >
        {isUSDFormat ? formatUSD(prevAmount) : formatNumber(prevAmount)}
      </Text>
      {newAmount.gt(0) && !prevAmount.eq(newAmount) ? (
        <Text as="span">
          &nbsp;→&nbsp;
          <Text as="span">
            {isUSDFormat ? formatUSD(newAmount.lt(0) ? 0 : newAmount) : formatNumber(newAmount.lt(0) ? 0 : newAmount)}
          </Text>
        </Text>
      ) : null}
      &nbsp;{symbol}
    </Text>
  )
}

export default AmountUpdateText
