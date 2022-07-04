import emptyFunction from 'utils/emptyFunction'
import React from 'react'
import ReactCollapsible from 'react-collapsible'

import Flex, { FlexProps } from '../Flex'

export type CollapsibleProps = {
  isExpanded: boolean
  header?: React.ReactElement | null
  children?: React.ReactNode
} & FlexProps

export default function Collapsible({ isExpanded, header, children, ...props }: CollapsibleProps) {
  return (
    <ReactCollapsible
      trigger={<>{header}</>}
      handleTriggerClick={emptyFunction}
      open={isExpanded}
      width="100%"
      easing="ease-out"
      transitionTime={150}
    >
      <Flex overflow="auto" flexDirection={'column'} {...props}>
        {children}
      </Flex>
    </ReactCollapsible>
  )
}
