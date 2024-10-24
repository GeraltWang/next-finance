'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { client } from '@/lib/hono'
import dayjs from '@/lib/dayjs'

import { InferResponseType } from 'hono'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { PatToken } from '@/features/pat/components/pat-token'
import { TableActions } from '@/features/pat/components/table-actions'

export type ResponseType = InferResponseType<typeof client.api.pat.$get, 200>['data'][0]

export const TableColumns: ColumnDef<ResponseType>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					name
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
	},
	{
		accessorKey: 'token',
		id: 'token',
		cell: ({ row }) => {
			const token = row.getValue('token') as string

			return <PatToken value={token} />
		},
	},
	{
		accessorKey: 'created at',
		id: 'createdAt',
		cell: ({ row }) => {
			const date = row.getValue('createdAt') as Date
			return <span>{dayjs(date).format('YYYY-MM-DD HH:mm')}</span>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return <TableActions id={row.original.id} />
		},
	},
]
