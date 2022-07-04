import emptyFunction from 'utils/emptyFunction'
import { Placement } from '@popperjs/core'
import React, { useEffect } from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import { TriggerType } from 'react-popper-tooltip'
import Fade from 'react-reveal/Fade'
import { Box } from 'rebass'

export type PopoverProps = {
  children: React.ReactNode
  innerRef?: HTMLElement | null
  isOpen: boolean
  onChange: (isOpen: boolean) => void
  isDisabled?: boolean
  trigger?: TriggerType
  placement?: Placement
  interactive?: boolean
  delayHide?: number
}

export type PopoverElement = React.ReactElement<PopoverProps>

export default function PopoverRef({
  innerRef,
  children,
  isOpen = false,
  onChange = emptyFunction,
  isDisabled,
  placement = 'bottom-start',
  trigger = 'click',
  interactive = false,
  delayHide = 60, // enough time to hover over popover gap
}: PopoverProps): PopoverElement | null {
  const { getArrowProps, getTooltipProps, triggerRef, setTooltipRef, setTriggerRef } = usePopperTooltip({
    trigger: trigger,
    visible: isOpen && !isDisabled,
    placement,
    onVisibleChange: onChange,
    interactive: interactive,
    delayHide: delayHide,
  })

  useEffect(() => {
    if (innerRef) {
      setTriggerRef(innerRef)
    }
  }, [innerRef, setTriggerRef])

  return isOpen ? (
    <Box ref={setTooltipRef} {...getTooltipProps()} minWidth={triggerRef?.clientWidth} sx={{ zIndex: 'popover' }}>
      <Fade
        top={placement.startsWith('bottom')}
        bottom={placement.startsWith('top')}
        left={placement.startsWith('right')}
        right={placement.startsWith('left')}
        distance="20px"
        duration={150}
      >
        {children}
      </Fade>
      <Box {...getArrowProps()} />
    </Box>
  ) : null
}
