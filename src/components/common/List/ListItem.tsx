import Text from 'components/common/Text'
import useHover from 'hooks/ui/useHover'
import useIsMobile from 'hooks/ui/useIsMobile'
import React, { useEffect } from 'react'
import { Box, Flex } from 'rebass'

import { LayoutProps } from 'components/layout/Layout'
import Center from '../Center'
import { IconType } from '../Icon'
import IconOrImage from '../Icon/IconOrImage'
import NextLink from '../Link/NextLink'

export type ListItemProps = {
  label: React.ReactNode | string
  sublabel?: React.ReactNode | string | null
  icon?: IconType | string | React.ReactNode | null
  rightContent?: IconType | string | React.ReactNode | null
  onClick?: (e: any) => void
  onHover?: (isHover: boolean) => void
  isSelected?: boolean
  isDisabled?: boolean
  isOutline?: boolean
  target?: string
  href?: string
  children?: React.ReactNode
} & LayoutProps

export type ListItemElement = React.ReactElement<ListItemProps>

export default function ListItem({
  label,
  sublabel,
  icon,
  rightContent,
  onClick,
  onHover,
  isSelected,
  isDisabled,
  isOutline,
  target,
  href,
  children,
  ...layoutProps
}: ListItemProps): ListItemElement {
  const [hoverRef, isHover] = useHover()
  useEffect(() => {
    if (onHover != null) {
      onHover(isHover)
    }
  }, [isHover, onHover])
  const isMobile = useIsMobile()
  return (
    <>
      <Box
        as="li"
        overflow="hidden"
        variant="listItem"
        className={isDisabled ? 'disabled' : undefined}
        {...layoutProps}
        sx={{
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          bg: isSelected ? 'active' : undefined,
          borderBottom: isOutline ? '1px solid' : undefined,
          borderBottomColor: 'background',
          ':last-of-type': {
            borderWidth: '0px',
          },
        }}
        onClick={onClick}
      >
        <NextLink href={href}>
          <Flex
            as={href ? 'a' : 'div'}
            href={href}
            target={target}
            ref={hoverRef}
            alignItems="center"
            justifyContent="flex-start"
            px={6}
            py={4}
            height="100%"
            sx={{
              textDecoration: 'none',
              color: 'lightText',
            }}
          >
            {icon ? (
              <Center mr={2}>{typeof icon === 'string' ? <IconOrImage src={icon} size={18} /> : icon}</Center>
            ) : null}
            <Flex flexGrow={1} flexDirection="column">
              {typeof label === 'string' || typeof label === 'number' ? (
                <Text variant={isMobile ? 'secondary' : 'body'} color={isDisabled ? 'label' : 'body'}>
                  {label}
                </Text>
              ) : (
                <Flex color={isDisabled ? 'lightText' : 'bodyText'} alignItems="center">
                  {label}
                </Flex>
              )}
              {sublabel != null &&
                (typeof sublabel === 'string' || typeof sublabel === 'number' ? (
                  <Text variant="label" color={isDisabled ? 'disabled' : 'label'}>
                    {sublabel}
                  </Text>
                ) : (
                  <Flex alignItems="center" color={isDisabled ? 'disabledText' : 'secondaryText'}>
                    {sublabel}
                  </Flex>
                ))}
            </Flex>
            {rightContent ? (
              <Center pl={8} minWidth="fit-content">
                {typeof rightContent === 'string' ? <IconOrImage src={rightContent} size={18} /> : rightContent}
              </Center>
            ) : null}
          </Flex>
        </NextLink>
      </Box>
      {children}
    </>
  )
}
