import useIsDarkMode from 'hooks/useIsDarkMode'
import useIsMobile from 'hooks/useIsMobile'
import React from 'react'
import ReactModal from 'react-modal'
import theme from 'theme'
import getValue from 'utils/getValue'

import IconButton from '../Button/IconButton'
import Card, { CardProps } from '../Card'
import Flex from '../Flex'
import Icon from '../Icon'
import { IconType } from '../Icon/IconSVG'
import Text from '../Text'
import MobileModal from './MobileModal'

export type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  isFullscreen?: boolean
} & CardProps

export default function Modal({ isOpen, isFullscreen, onClose, title, children, ...cardProps }: Props) {
  const [isDarkMode] = useIsDarkMode()

  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <MobileModal isOpen={isOpen} onClose={onClose} title={title} {...cardProps}>
        {children}
      </MobileModal>
    )
  } else {
    // TODO: @earthtojake Build desktop modal natively
    return (
      <ReactModal
        style={{
          content: {
            background: 'transparent',
            border: 'none',
            maxWidth: '100%',
            padding: 0,
            marginBottom: '10%',
            width: 'auto',
            position: 'relative',
            overflow: 'visible',
          },
          overlay: {
            background: !isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(15, 15, 15, 0.65)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'visible',
            position: 'fixed',
            zIndex: getValue(theme, 'zIndex.modal'),
          },
        }}
        ariaHideApp={false}
        preventScroll={true}
        isOpen={isOpen}
        onRequestClose={onClose}
      >
        <Card maxWidth={600} minWidth={380} isSolid>
          <Flex px={6} py={4} width="100%">
            {title ? (
              <Text ml={36} flexGrow={1} variant="heading" textAlign="center">
                {title}
              </Text>
            ) : null}
            <IconButton
              ml="auto"
              variant="light"
              icon={<Icon icon={IconType.X} size={16} />}
              size="md"
              onClick={onClose}
            />
          </Flex>
          <Flex flexDirection="column" {...cardProps}>
            {children}
          </Flex>
        </Card>
      </ReactModal>
    )
  }
}
