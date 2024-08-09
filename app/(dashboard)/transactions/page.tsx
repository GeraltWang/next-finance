'use client'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { Loader2, Plus } from 'lucide-react'
import { columns } from './columns'

const TransactionsPage = () => {
	const { onOpen } = useNewTransaction()

	const { data, isLoading } = useGetTransactions()

	const transactions = data || []

	const deleteTransactions = useBulkDeleteTransactions()

	const isDisabled = isLoading || deleteTransactions.isPending

	if (isLoading) {
		return (
			<section className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
				<Card className='border-none drop-shadow-sm'>
					<CardHeader>
						<Skeleton className='h-8 w-48' />
					</CardHeader>
					<CardContent>
						<div className='w-full h-[500px] flex justify-center items-center'>
							<Loader2 className='size-6 text-slate-300 animate-spin' />
						</div>
					</CardContent>
				</Card>
			</section>
		)
	}

	return (
		<section className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='text-xl line-clamp-1'>Transactions</CardTitle>
					<Button size={'sm'} onClick={onOpen}>
						<Plus className='size-4 mr-2' />
						Add New Transaction
					</Button>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={transactions}
						filterKey='name'
						disabled={isDisabled}
						onDelete={row => {
							const ids = row.map(r => r.original.id)
							deleteTransactions.mutate({ ids })
						}}
					/>
				</CardContent>
			</Card>
		</section>
	)
}

export default TransactionsPage
