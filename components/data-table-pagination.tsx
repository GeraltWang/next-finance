import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react'

import { type Table as TableType } from '@tanstack/react-table'

interface Props<TData> {
	table: TableType<TData>
}

export function DataTablePagination<TData>({ table }: Props<TData>) {
	return (
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
	)
}
