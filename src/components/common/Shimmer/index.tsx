import useIsDarkMode from 'hooks/ui/useIsDarkMode'
import React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'
import { LayoutProps, MarginProps } from 'styled-system'
import { ResponsiveValue } from 'types'

type Props = { borderRadius?: ResponsiveValue } & LayoutProps & MarginProps

function ShimmerRaw({ width = '100%', height = '100%', borderRadius = 'text', ...styleProps }: Props) {
  const [isDarkMode] = useIsDarkMode()
  return (
    <Box
      width={width}
      height={height}
      sx={{
        borderRadius,
        backgroundColor: (isDarkMode ? '#383838' : '#f6f7f8') + '80',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          transform: 'translateX(-100%)',
          background: isDarkMode
            ? 'linear-gradient(90deg, rgba(200, 200, 200, 0) 0%, rgba(200, 200, 200, 0.15) 20%, rgba(200, 200, 200, 0.02) 40%, rgba(200, 200, 200, 0.01) 60%, rgba(200, 200, 200, 0) 100% )'
            : 'linear-gradient(to right, #edeef100 0%, #e8e8e8 20%, #f6f7f833 40%, #f6f7f800 100%)',
          animation: 'shimmer 1.25s infinite',
          content: '""',
          borderRadius,
        },
      }}
      {...styleProps}
    />
  )
}

const Shimmer = styled(ShimmerRaw)`
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    80% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`

export default Shimmer
