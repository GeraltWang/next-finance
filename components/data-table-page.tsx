'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Trash, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react'

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
			<div className='flex items-center justify-end space-x-2 py-4'>
				<div className='hidden flex-1 text-sm font-light text-muted-foreground sm:block'>
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className='flex flex-wrap gap-4'>
					<div className='flex items-center gap-2 text-sm font-medium'>
						Rows per page
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={value => {
								table.setPageSize(Number(value))
							}}
						>
							<SelectTrigger className='h-8 w-[100px]'>
								<SelectValue placeholder={table.getState().pagination.pageSize} />
							</SelectTrigger>
							<SelectContent side='top'>
								{[10, 20, 30, 40, 50].map(pageSize => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='flex items-center justify-center text-sm font-medium'>
						Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
					</div>
					<div className='flex w-full justify-end gap-2 sm:w-auto sm:justify-stretch'>
						<Button
							className='size-8'
							variant='outline'
							size='icon'
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronsLeft className='size-4' />
						</Button>
						<Button
							className='size-8'
							variant='outline'
							size='icon'
							onClick={() => {
								table.previousPage()
							}}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft className='size-4' />
						</Button>
						<Button
							className='size-8'
							variant='outline'
							size='icon'
							onClick={() => {
								table.nextPage()
							}}
							disabled={!table.getCanNextPage()}
						>
							<ChevronRight className='size-4' />
						</Button>
						<Button
							className='size-8'
							variant='outline'
							size='icon'
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<ChevronsRight className='size-4' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
