import { Placement } from '@popperjs/core'
import React, { ElementType, useState } from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import { Box, Flex, Link, Text } from 'rebass'
import { LayoutProps, MarginProps } from 'styled-system'

export type TooltipConfig = {
  title?: string
  content: React.ReactNode
  href?: string
  linkVariant?: string
  placement?: Placement
  delayShow?: number
}

export type TooltipProps = {
  children: React.ReactNode
  disabled?: boolean
  as?: ElementType<any>
  verticalAlign?: string
} & TooltipConfig &
  MarginProps &
  LayoutProps

export default function Tooltip({
  title,
  content,
  href,
  children,
  placement = 'top-start',
  linkVariant = 'link',
  delayShow = 0,
  disabled = false,
  as,
  verticalAlign,
  ...styleProps
}: TooltipProps) {
  const [controlledVisible, setControlledVisible] = useState(false)
  const isInteractive = href != null && href !== ''
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip({
    trigger: 'hover',
    // Keep enabled to prevent flickering https://github.com/mohsinulhaq/react-popper-tooltip/issues/118
    interactive: true,
    delayHide: isInteractive ? 40 : 0,
    delayShow,
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
    offset: [8, 8],
    placement,
  })
  return (
    <>
      <Flex
        verticalAlign={verticalAlign}
        as={as}
        ref={setTriggerRef}
        {...styleProps}
        sx={{ cursor: disabled ? 'not-allowed' : 'help', display: 'inline-block' }}
      >
        {children}
      </Flex>
      {!disabled && controlledVisible ? (
        <Box
          sx={{
            zIndex: 'popover',
          }}
          ref={setTooltipRef}
          {...getTooltipProps()}
        >
          <Box variant="card" p={4} textAlign="left">
            {title != null && (
              <Text mb={2} variant="body">
                {title}
              </Text>
            )}
            <Text mb={href != null ? 2 : 0} variant="body" color="lightText">
              {content}
            </Text>
            {href != null && href !== '' && (
              <Link variant={linkVariant} href={href} target="_blank">
                Learn More →
              </Link>
            )}
          </Box>
          <Box {...getArrowProps()} />
        </Box>
      ) : null}
    </>
  )
}
