import useIsMobile from 'hooks/useIsMobile'
import React from 'react'

import ListItem, { ListItemProps } from '../List/ListItem'
import Text from '../Text'

export type DropdownButtonListItemProps = Omit<ListItemProps, 'variant'>

export type DropdownButtonListItemElement = React.ReactElement<DropdownButtonListItemProps>

export default function DropdownButtonListItem({
  label,
  isDisabled,
  ...props
}: DropdownButtonListItemProps): DropdownButtonListItemElement {
  const isMobile = useIsMobile()
  let dropdownLabel = label
  if (isMobile && typeof label === 'string') {
    dropdownLabel = (
      <Text variant="heading" color={isDisabled ? 'disabled' : 'light'} my={2}>
        {label}
      </Text>
    )
  }
  return <ListItem {...props} isOutline={isMobile} label={dropdownLabel} isDisabled={isDisabled} />
}
