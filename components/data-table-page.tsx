'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Trash } from 'lucide-react'
import { DataTablePagination } from '@/components/data-table-pagination'

import {
	ColumnDef,
	ColumnFiltersState,
	Row,
	SortingState,
	type Table as TableType,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'

import { useConfirm } from '@/hooks/use-confirm'
import { formUrlQuery } from '@/lib/query'
import { getValidNumber } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	total?: number
	pageCount?: number
	filterKey?: string
	disabled?: boolean
	bulkButton?: ({ table }: { table: TableType<TData> }) => JSX.Element
	onDelete?: (rows: Row<TData>[]) => void
}

export function DataTablePage<TData, TValue>({
	columns,
	data,
	total,
	pageCount,
	filterKey,
	disabled,
	bulkButton,
	onDelete,
}: DataTableProps<TData, TValue>) {
	const router = useRouter()

	const searchParams = useSearchParams()

	const page = getValidNumber(searchParams.get('page'), 1)
	const size = getValidNumber(searchParams.get('pageSize'), 10)

	const [{ pageIndex, pageSize }, setPagination] = useState({
		pageIndex: page - 1, //initial page index
		pageSize: size, //default page size
	})

	useEffect(() => {
		setPagination({
			pageIndex: page - 1,
			pageSize: size,
		})
	}, [page, size])

	const pagination = useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize]
	)

	const createQueryString = (queryParams: Record<string, any>) => {
		return formUrlQuery({ params: searchParams.toString(), queryParams })
	}

	useEffect(() => {
		router.push(`${createQueryString({ page: pageIndex + 1, pageSize })}`, {
			scroll: false,
		})
	}, [pageIndex, pageSize])

	const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This action cannot be undone.')

	const [sorting, setSorting] = useState<SortingState>([])

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const [rowSelection, setRowSelection] = useState({})

	const table = useReactTable({
		data,
		columns,
		pageCount: pageCount ?? -1,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		manualPagination: true, //turn off client-side pagination
		rowCount: total,
		state: {
			sorting,
			columnFilters,
			rowSelection,
			pagination,
		},
	})

	return (
		<div>
			<ConfirmDialog />
			<div className='flex flex-col justify-between gap-2 py-4 md:flex-row'>
				{filterKey && (
					<Input
						placeholder={`Filter ${filterKey}...`}
						value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
						onChange={event => table.getColumn(filterKey)?.setFilterValue(event.target.value)}
						className='md:max-w-sm'
					/>
				)}
				<div className='flex w-full flex-wrap items-center justify-end gap-2'>
					{table.getFilteredSelectedRowModel().rows.length > 0 && (
						<>
							{bulkButton?.({ table })}
							<Button
								className='hover:text-destructive-hover border-destructive text-xs font-normal text-destructive'
								size={'sm'}
								variant={'outline'}
								disabled={disabled}
								onClick={async () => {
									const ok = await confirm()
									if (ok) {
										onDelete?.(table.getFilteredSelectedRowModel().rows)
										table.resetRowSelection()
									}
								}}
							>
								<Trash className='mr-2 size-4' />
								Delete ({table.getFilteredSelectedRowModel().rows.length})
							</Button>
						</>
					)}
				</div>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	)
}
