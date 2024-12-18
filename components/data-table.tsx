'use client'

import { useState, type JSX } from 'react'

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

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	filterKey?: string
	disabled?: boolean
	bulkButton?: ({ table }: { table: TableType<TData> }) => JSX.Element
	onDelete?: (rows: Row<TData>[]) => void
}

export function DataTable<TData, TValue>({
	columns,
	data,
	filterKey,
	disabled,
	bulkButton,
	onDelete,
}: DataTableProps<TData, TValue>) {
	const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This action cannot be undone.')

	const [sorting, setSorting] = useState<SortingState>([])

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const [rowSelection, setRowSelection] = useState({})

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			rowSelection,
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
				<div className='flex-1 text-sm text-muted-foreground'>
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<Button
					variant='outline'
					size='icon'
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronsLeft className='size-4' />
				</Button>
				<Button
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
					variant='outline'
					size='icon'
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<ChevronsRight className='size-4' />
				</Button>
			</div>
		</div>
	)
}
