'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { type Table } from '@tanstack/react-table'

import { DataTablePage } from '@/components/data-table-page'
import type { ResponseType } from '@/features/transactions/components/table-columns'
import { TableColumns } from '@/features/transactions/components/table-columns'
import { UploadButton } from '@/features/transactions/components/upload-button'
import { TransactionTableFallback } from '@/features/transactions/components/transaction-table-fallback'
import { useGetTransactionsPage } from '@/features/transactions/api/use-get-transactions-page'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { useOpenEditCategory } from '@/features/transactions/hooks/use-open-edit-category'
import { useBulkMarkAsExpense } from '@/features/transactions/api/use-bulk-mark-as-expense'
import { useConfirm } from '@/hooks/use-confirm'

type Props = {
	onUpload: (results: any) => void
}

export const TransactionTable = ({ onUpload }: Props) => {
	const { data, isLoading, isPlaceholderData } = useGetTransactionsPage()

	const transactions = data?.data || []

	const deleteTransactions = useBulkDeleteTransactions()

	const isDisabled = isLoading || isPlaceholderData || deleteTransactions.isPending

	const { onOpen: onOpenEditTransactionCategory } = useOpenEditCategory()

	const [ConfirmMarkDialog, confirmMark] = useConfirm(
		'Are you sure?',
		'This action cannot be undone.'
	)

	const editTransactions = useBulkMarkAsExpense()

	const { onOpen } = useNewTransaction()

	const renderMarkAsExpenseButton = ({ table }: { table: Table<ResponseType> }) => {
		return (
			<>
				<Button
					className='text-xs font-normal'
					size={'sm'}
					variant={'outline'}
					disabled={isDisabled}
					onClick={async () => {
						const ids = table.getFilteredSelectedRowModel().rows.map(row => row.original.id)
						onOpenEditTransactionCategory(ids, table)
					}}
				>
					Edit category ({table.getFilteredSelectedRowModel().rows.length})
				</Button>
				<Button
					className='text-xs font-normal'
					size={'sm'}
					variant={'outline'}
					disabled={isDisabled}
					onClick={async () => {
						const ok = await confirmMark()
						if (ok) {
							const payload = {
								ids: table.getFilteredSelectedRowModel().rows.map(r => r.original.id),
							}
							editTransactions.mutate(payload)
							table.resetRowSelection()
						}
					}}
				>
					Mark as expense ({table.getFilteredSelectedRowModel().rows.length})
				</Button>
			</>
		)
	}

	if (isLoading) {
		return <TransactionTableFallback />
	}

	return (
		<>
			<ConfirmMarkDialog />
			<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
				<Card className='border-none drop-shadow-sm'>
					<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
						<CardTitle className='line-clamp-1 text-xl'>Transactions</CardTitle>
						<div className='flex flex-col items-center gap-2 lg:flex-row'>
							<Button className='w-full lg:w-auto' size={'sm'} onClick={onOpen}>
								<Plus className='mr-2 size-4' />
								Add New Transaction
							</Button>
							<UploadButton onUpload={onUpload} />
						</div>
					</CardHeader>
					<CardContent>
						<DataTablePage
							columns={TableColumns}
							data={transactions}
							total={data?.totalCount}
							pageCount={data?.pageCount}
							filterKey='payee'
							disabled={isDisabled}
							onDelete={row => {
								const ids = row.map(r => r.original.id)
								deleteTransactions.mutate({ ids })
							}}
							bulkButton={renderMarkAsExpenseButton}
						/>
					</CardContent>
				</Card>
			</section>
		</>
	)
}
