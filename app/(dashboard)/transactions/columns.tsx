'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { client } from '@/lib/hono'
import { InferResponseType } from 'hono'
import { ArrowUpDown } from 'lucide-react'

import { ColumnDef } from '@tanstack/react-table'
import { Actions } from './Actions'
import dayjs from 'dayjs'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { AccountColumn } from './AccountColumn'
import { CategoryColumn } from './CategoryColumn'

export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>['data'][0]

export const columns: ColumnDef<ResponseType>[] = [
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
		accessorKey: 'date',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Date
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => {
			const date = row.getValue('date') as Date
			return <span>{dayjs(date).format('YYYY-MM-DD HH:mm')}</span>
		},
	},
	{
		accessorKey: 'category',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Category
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => {
			return (
				<CategoryColumn
					id={row.original.id}
					category={row.original.category?.name}
					categoryId={row.original.categoryId}
				/>
			)
		},
	},
	{
		accessorKey: 'payee',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Payee
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
	},
	{
		accessorKey: 'amount',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Amount
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('amount'))
			return (
				<Badge
					className='px-3.5 py-2.5 text-xs font-medium'
					variant={amount < 0 ? 'destructive' : 'primary'}
				>
					{formatCurrency(amount)}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'account',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Account
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => {
			return (
				<AccountColumn account={row.original.account.name} accountId={row.original.accountId} />
			)
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return <Actions id={row.original.id} />
		},
	},
]
