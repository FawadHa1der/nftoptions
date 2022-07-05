import Text, { TextProps } from 'components/Text'
import React, { useEffect, useState } from 'react'
import { LayoutProps, MarginProps } from 'styled-system'
import formatDuration from 'utils/formatDuration'
import formatTruncatedDuration from 'utils/formatTruncatedDuration'
import parseDate from 'utils/parseDate'

type Props = {
  timestamp: number // seconds or milliseconds
  showSeconds?: boolean
  fallback?: string
  prefix?: string
  truncated?: boolean
} & TextProps &
  LayoutProps &
  MarginProps

// TODO: add block timestamp countdown
export default function Countdown({
  timestamp: _timestamp,
  showSeconds,
  fallback = '',
  prefix,
  truncated,
  ...textProps
}: Props) {
  const timestamp = parseDate(_timestamp).getTime() / 1000
  const [now, setNow] = useState(new Date().getTime() / 1000)
  useEffect(() => {
    setNow(new Date().getTime() / 1000)
    const i = setInterval(() => {
      setNow(new Date().getTime() / 1000)
    }, 1000)
    return () => clearInterval(i)
  }, [timestamp])
  const duration = timestamp - now
  return (
    <Text {...textProps}>
      {/* render fallback text when countdown is complete */}
      {prefix != null && now < timestamp ? prefix + ' ' : ''}
      {now < timestamp
        ? truncated
          ? formatTruncatedDuration(duration)
          : formatDuration(duration, duration < 24 * 60 * 60 || showSeconds)
        : fallback}
    </Text>
  )
}
