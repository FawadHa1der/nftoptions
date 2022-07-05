import { BigNumberish } from '@ethersproject/bignumber'
import IconButton from 'components/common/Button/IconButton'
import Icon, { IconType } from 'components/common/Icon'
import React, { useCallback, useMemo, useState } from 'react'
import { Cell, CellProps, Column, Row, useFlexLayout, useRowState, useSortBy, useTable } from 'react-table'
import { Box, Flex } from 'rebass'
import { LayoutProps, MarginProps } from 'styled-system'

import Collapsible from '../Collapsible'
import Text from '../Text'

export type TableRecordType = Record<string, boolean | BigNumberish | { [key: string]: any } | null>

export type TableRowVariant = 'default' | 'success' | 'error'

export type TableData<T extends TableRecordType> = {
  id?: string
  isExpanded?: boolean
  expanded?: React.ReactNode
  onToggleExpand?: (id: string) => void
  onClick?: () => void
  variant?: TableRowVariant
} & T

export type TableProps<T extends TableRecordType> = {
  data: Array<TableData<T>>
  // Columns must be memoized https://react-table.tanstack.com/docs/api/useTable#table-options
  columns: Array<Column<TableData<T>>>
  pageSize?: number
  isOutline?: boolean
} & MarginProps &
  LayoutProps

export type TableColumn<D extends Record<string, unknown> = any> = Column<D>

export type TableCellProps<D extends Record<string, unknown>, V = any> = CellProps<D, V>

export type TableElement<T extends TableRecordType> = React.ReactElement<TableProps<T>>

/* 
  To bypass TypeScript type checking, we had to resort to the `as any`
  hack. This is a safe compromise since we handle null value gracefully.
*/
export default function Table<T extends TableRecordType>({
  columns,
  data,
  pageSize,
  isOutline,
  ...styleProps
}: TableProps<T>): TableElement<T> {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useFlexLayout,
    useRowState
  )

  const [page, _setPage] = useState(0)

  const numPages = pageSize ? Math.ceil(rows.length / pageSize) : 1
  const setPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < numPages) {
        _setPage(page)
      }
    },
    [numPages, _setPage]
  )
  const pagedRows = useMemo(() => {
    if (!pageSize) {
      return rows
    } else {
      const start = page * pageSize
      return rows.slice(start, start + pageSize)
    }
  }, [rows, page, pageSize])

  return (
    <Box {...styleProps}>
      <Box
        width="100%"
        height="100%"
        as="table"
        {...(getTableProps() as any)}
        sx={{ position: 'relative', borderCollapse: 'collapse' }}
      >
        <Flex as="thead" py={4}>
          {headerGroups.map((headerGroup, idx) => (
            <Box key={idx} as="tr" {...(headerGroup.getHeaderGroupProps() as any)}>
              {headerGroup.headers.map(column => {
                const header = column.render('Header')
                const headerProps = column.getHeaderProps()
                const sortByToggleProps = (column as any)?.getSortByToggleProps()
                const canSort = !!(column as any).canSort
                const isSorted = !!(column as any).isSorted
                const isSortedDesc = !!(column as any).isSortedDesc
                return (
                  <Flex alignItems="center" as="th" px={6} {...headerProps} key={column.id}>
                    <Text
                      variant="secondary"
                      color={isSorted ? 'light' : 'label'}
                      textAlign="left"
                      key={column.id}
                      onClick={sortByToggleProps?.onClick}
                      sx={{
                        cursor: canSort ? 'pointer' : undefined,
                        ':hover': {
                          color: canSort ? 'lightText' : undefined,
                        },
                      }}
                    >
                      {header}
                    </Text>
                    {isSorted ? (
                      <Icon
                        strokeWidth={3}
                        ml={2}
                        color="lightText"
                        size={12}
                        mb="1px"
                        icon={isSortedDesc ? IconType.ArrowDown : IconType.ArrowUp}
                      />
                    ) : null}
                  </Flex>
                )
              })}
            </Box>
          ))}
        </Flex>
        {pagedRows.map((row, rowIdx) => {
          prepareRow(row)
          const isExpanded =
            (row as any).state.expanded !== undefined ? !!(row as any).state.expanded : !!row.original.isExpanded
          const setState = (row as any).setState
          const prepareRowProps = (row: Row<TableData<T>>) => {
            const rowProps = row.getRowProps()
            const { style } = rowProps

            return {
              ...rowProps,
              style: {
                ...style,
              },
            }
          }

          const prepareCellProps = (cell: Cell<TableData<T>, any>) => {
            const cellProps = cell.getCellProps()
            const { style } = cellProps

            return {
              ...cellProps,
              style: {
                ...style,
              },
            }
          }
          const expandedContent = row.original.expanded
          const onToggleExpand = () => {
            setState({ expanded: !isExpanded })
            if (row.original.onToggleExpand) {
              row.original.onToggleExpand(row.original.id ? row.original.id : row.id)
            }
          }
          return (
            <Box
              as="tbody"
              key={row.id}
              sx={{
                cursor: 'pointer',
                bg: !isExpanded ? 'transparent' : 'hover',
                '&:hover': {
                  bg: isExpanded ? 'active' : 'hover',
                },
                '&:active': {
                  bg: 'active',
                },
                borderBottom: isOutline && rowIdx < pagedRows.length - 1 ? '1px solid' : undefined,
                borderBottomColor: 'background',
              }}
              onClick={() =>
                expandedContent ? onToggleExpand() : row.original.onClick ? row.original.onClick() : null
              }
            >
              <Box as="tr" {...(prepareRowProps(row) as any)}>
                {row.cells.map((cell: any, cellIdx) => {
                  return (
                    <Flex as="td" key={cellIdx} alignItems="center" px={6} py={4} {...(prepareCellProps(cell) as any)}>
                      {cell.render('Cell')}
                    </Flex>
                  )
                })}
              </Box>
              <Box
                as="tr"
                sx={{
                  borderBottom: !isOutline && isExpanded && rowIdx < pagedRows.length - 1 ? '1px solid' : undefined,
                  borderBottomColor: 'background',
                }}
              >
                <Box as="td">
                  <Collapsible isExpanded={isExpanded && expandedContent != null}>
                    <Box px={6} py={4}>
                      {expandedContent}
                    </Box>
                  </Collapsible>
                </Box>
              </Box>
            </Box>
          )
        })}
        {numPages > 1 ? (
          <Box as="tfoot">
            <Box as="tr">
              <Flex as="td" colSpan={10000} px={6} py={4} justifyContent="flex-start" alignItems="center">
                <IconButton
                  size="sm"
                  variant="light"
                  isTransparent
                  onClick={() => setPage(Math.max(0, page - 1))}
                  icon={IconType.ChevronLeft}
                />
                <Text variant="small" color="light" mx={3}>
                  {page + 1} / {numPages}
                </Text>
                <IconButton
                  size="sm"
                  variant="light"
                  isTransparent
                  onClick={() => setPage(Math.min(numPages - 1, page + 1))}
                  icon={IconType.ChevronRight}
                />
              </Flex>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}
