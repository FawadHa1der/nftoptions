import useThemeColor from 'hooks/ui/useThemeColor'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ModalContext } from 'theme/ModalProvider'
import isServer from 'utils/isServer'

import Box from '../Box'
import { CardProps } from '../Card'
import Center from '../Center'
import Flex from '../Flex'
import Text from '../Text'

export type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
} & CardProps

// TODO: @earthtojake Make these constants parameters
const MOBILE_FOOTER_HEIGHT = 72

export default function MobileModal({ children, isOpen, onClose, id, title, ...cardProps }: Props) {
  const { openModalId, setOpenModalId } = useContext(ModalContext)
  const [_id, setId] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen && !_id) {
      // Assign ID on open
      const id = openModalId + 1
      setId(id)
      // Increment open modals
      setOpenModalId(id)
    } else if (!isOpen && _id) {
      // Decrement open modals
      setOpenModalId(openModalId - 1)
      // Remove ID on close
      setId(null)
    }
    // Set modal to local state
  }, [isOpen, setOpenModalId, openModalId, _id])

  useEffect(() => {
    if (_id && _id > openModalId) {
      // Sync local state to modal (e.g. on modal close)
      onClose()
      setId(null)
    }
    // Causes infinite loop if onClose is not memoized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModalId])

  const background = useThemeColor('background')
  const modalBackground = useThemeColor('modalBackground')

  const modalContainer = useRef(!isServer() ? document.getElementById('modal-container') : null)?.current

  if (!modalContainer) {
    console.warn('Failed to mount modal-container')
    return null
  }

  return createPortal(
    isOpen ? (
      <Flex
        width="100%"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: MOBILE_FOOTER_HEIGHT,
          maxHeight: '100vh',
          zIndex: 'modal',
        }}
        bg={`${background}B3`}
        flexDirection="column"
        justifyContent="flex-end"
        onClick={onClose}
        id={id}
      >
        {/* TODO: @michaelxuwu Animate modal appearance (using react-spring?) */}
        <Box
          {...cardProps}
          mt="auto"
          width="100%"
          bg={`${modalBackground}`}
          overflow="auto"
          // Block parent onClose trigger
          onClick={e => e.stopPropagation()}
        >
          {title ? (
            <Center p={4}>
              <Text variant="heading">{title}</Text>
            </Center>
          ) : null}
          {children}
        </Box>
      </Flex>
    ) : null,
    modalContainer
  )
}
