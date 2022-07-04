import Box from 'components/common/Box'
import useThemeColor from 'hooks/ui/useThemeColor'
import React from 'react'
import {
  Area,
  AreaChart as RechartsAreaChart,
  AreaProps,
  ReferenceLine,
  ReferenceLineProps as RechartsReferenceLineProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AxisDomain as RechartsAxisDomain, Margin } from 'recharts/types/util/types'
import { LayoutProps, MarginProps } from 'styled-system'

import Text from '../Text'

export type ReferenceLineProps = RechartsReferenceLineProps
export type AxisDomain = RechartsAxisDomain

export type CustomAreaChartKey<AreaData> = {
  label: string
  key: keyof AreaData
  strokeColor: string
  fillColor: string
  strokeWidth?: number
  opacity?: number
  fillOpacity?: number
  strokeDasharray?: string
  activeDot?: boolean | React.ReactNode
  stackId?: string
}

export type DataPoint = {
  x: number
  [key: string]: number
}

type Props<T extends DataPoint> = {
  domain?: AxisDomain
  range?: AxisDomain
  // Array of objects
  data: T[]
  // Descriptor for each line
  dataKeys: CustomAreaChartKey<T>[]
  type: AreaProps['type']
  hideXAxis?: boolean
  renderTooltip?: (payload: T) => React.ReactNode | string
  onClickArea?: (key: string) => void
  onHover?: (payload: T | null) => void
  onMouseLeave?: () => void
  referenceLinesProps?: ReferenceLineProps[]
  chartMargin?: Margin
} & LayoutProps &
  MarginProps

export default function AreaChart<T extends DataPoint>({
  data,
  dataKeys,
  domain,
  range,
  hideXAxis = true,
  onHover,
  renderTooltip,
  onMouseLeave,
  referenceLinesProps,
  type,
  chartMargin = { top: 24, bottom: 8 },
  ...styleProps
}: Props<T>): JSX.Element {
  const background = useThemeColor('background')
  const label = useThemeColor('secondaryText')
  return (
    <Box {...styleProps}>
      <ResponsiveContainer width="100%" height="100%" minWidth={undefined}>
        <RechartsAreaChart
          data={data}
          margin={chartMargin}
          onMouseLeave={() => {
            if (onHover) {
              onHover(null)
            }
          }}
          onMouseUp={() => {
            if (onHover) {
              onHover(null)
            }
          }}
        >
          {hideXAxis ? null : <ReferenceLine y={0} stroke={label} />}
          <XAxis hide={true} dataKey="x" type="number" domain={domain ?? ['dataMin', 'dataMax']} />
          <YAxis hide={true} type="number" domain={range ?? ['dataMin', 'dataMax']} />
          {renderTooltip ? (
            <Tooltip
              cursor={{ visibility: 'default', stroke: label }}
              allowEscapeViewBox={{ x: true, y: true }}
              isAnimationActive={false}
              offset={0}
              content={prop => {
                if (onHover && prop.payload && prop.payload.length) {
                  onHover(prop.payload[0].payload)
                }
                if (prop.payload && prop.payload.length) {
                  const tooltip = renderTooltip(prop.payload[0].payload)
                  return typeof tooltip === 'string' ? (
                    <Text variant="small" color="label" ml="-50%">
                      {tooltip}
                    </Text>
                  ) : (
                    tooltip
                  )
                }
                return null
              }}
              position={{ y: 0 }}
            />
          ) : null}

          {referenceLinesProps
            ? referenceLinesProps.map(referenceLineProps => (
                <ReferenceLine key={referenceLineProps.id} {...referenceLineProps} />
              ))
            : null}
          {dataKeys.map(dataKey => {
            return (
              <Area
                key={dataKey.key.toString()}
                dataKey={dataKey.key.toString()}
                animationDuration={300}
                activeDot={dataKey.activeDot ? dataKey.activeDot : { stroke: background }}
                opacity={dataKey.opacity}
                type={type}
                strokeWidth={dataKey.strokeWidth ?? 2}
                stroke={dataKey.strokeColor}
                strokeDasharray={dataKey.strokeDasharray}
                fill={dataKey.fillColor}
                fillOpacity={dataKey.fillOpacity}
                dot={false}
                stackId={dataKey.stackId}
              />
            )
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </Box>
  )
}
