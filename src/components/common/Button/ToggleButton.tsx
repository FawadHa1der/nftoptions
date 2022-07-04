import Flex from 'components/common/Flex'
import Text from 'components/common/Text'
import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

export type ToggleButtonItemProps<ToggleButtonItemID extends string | number = string | number> = {
  id: ToggleButtonItemID
  label: string
}

export type ToggleButtonProps<ToggleButtonItemID extends string | number = string | number> = {
  items: ToggleButtonItemProps<ToggleButtonItemID>[]
  selectedItemId: ToggleButtonItemID
  onChange?: (itemId: ToggleButtonItemID) => void
} & MarginProps &
  LayoutProps

export type ToggleButtonElement = React.ReactElement<ToggleButtonProps>

export default function ToggleButton<ToggleButtonItemID extends string | number = string | number>({
  items,
  selectedItemId,
  onChange,
  ...styleProps
}: ToggleButtonProps<ToggleButtonItemID>): ToggleButtonElement {
  return (
    <Flex
      alignItems="center"
      px={'6px'}
      py={'6px'}
      bg="buttonBackground"
      sx={{ borderRadius: 'circle' }}
      height={36}
      {...styleProps}
    >
      {items.map((item, idx) => {
        const isSelected = item.id === selectedItemId
        return (
          <Flex
            key={item.id}
            mr={idx < items.length - 1 ? '6px' : 0}
            height="100%"
            width="100%"
            onClick={() => (onChange ? onChange(item.id) : null)}
            bg={isSelected ? 'cardBackgroundSolid' : 'transparent'}
            alignItems="center"
            justifyContent="center"
            sx={{
              borderRadius: 'circle',
              cursor: 'pointer',
              ':hover': { bg: isSelected ? 'cardBackgroundSolid' : 'buttonHover' },
            }}
            px={4}
          >
            <Text variant="secondary" color={isSelected ? 'body' : 'light'}>
              {item.label}
            </Text>
          </Flex>
        )
      })}
    </Flex>
  )
}
