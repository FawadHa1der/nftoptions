import useIsMobile from 'hooks/useIsMobile'
import { Placement } from '@popperjs/core'
import React, { useState } from 'react'

import Button, { ButtonProps } from '../Button'
import Card from '../Card'
import { IconType } from '../Icon'
import List from '../List'
import Modal from '../Modal'
import Popover from '../Popover'
import { DropdownButtonListItemElement } from './DropdownButtonListItem'

export type DropdownButtonProps = {
  isOpen: boolean
  onClose: () => void
  children?: DropdownButtonListItemElement | (DropdownButtonListItemElement | null)[] | null
  placement?: Placement
} & Omit<ButtonProps, 'rightIcon' | 'children'>

export type DropdownButtonElement = React.ReactElement<DropdownButtonProps>

export default function DropdownButton({
  children,
  placement,
  isOpen,
  onClose,
  ...buttonProps
}: DropdownButtonProps): DropdownButtonElement {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const isMobile = useIsMobile()
  return (
    <>
      <Button
        ref={setRef}
        {...buttonProps}
        rightIcon={!isOpen ? IconType.ChevronDown : IconType.ChevronUp}
        rightIconSpacing={1}
      />
      {!isMobile ? (
        <Popover
          placement={placement}
          innerRef={ref}
          isOpen={isOpen}
          onChange={isOpen => {
            if (!isOpen) {
              onClose()
            }
          }}
        >
          <Card isSolid overflow="hidden">
            <List>{children}</List>
          </Card>
        </Popover>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <List>{children}</List>
        </Modal>
      )}
    </>
  )
}
