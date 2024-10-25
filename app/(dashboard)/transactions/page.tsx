'use client'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { Loader2, Plus } from 'lucide-react'
import { TableColumns } from '@/features/transactions/components/table-columns'
import { useState } from 'react'
import { UploadButton } from '@/features/transactions/components/upload-button'
import { ImportCard } from '@/features/transactions/components/import-card'
import { TransactionSchema } from '@/features/transactions/schemas/index'
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account'
import { toast } from 'sonner'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions'
import { z } from 'zod'
import { Table } from '@tanstack/react-table'
import { useConfirm } from '@/hooks/use-confirm'
import { useBulkMarkAsExpense } from '@/features/transactions/api/use-bulk-mark-as-expense'
import type { ResponseType } from '@/features/transactions/components/table-columns'
import { convertAmountToMiliunits } from '@/lib/utils'
import { useOpenEditCategory } from '@/features/transactions/hooks/use-open-edit-category'

enum VARIANTS {
	LIST = 'LIST',
	IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULT = {
	data: [],
	errors: [],
	meta: {},
}

const TransactionsPage = () => {
	const [SelectAccountDialog, confirm] = useSelectAccount()

	const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)

	const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULT)

	const onUpload = (results: typeof INITIAL_IMPORT_RESULT) => {
		setVariant(VARIANTS.IMPORT)
		setImportResults(results)
	}

	const onCancelImport = () => {
		setVariant(VARIANTS.LIST)
		setImportResults(INITIAL_IMPORT_RESULT)
	}

	const bulkCreateTransactions = useBulkCreateTransactions()

	const onSubmitImport = async (values: z.input<typeof TransactionSchema>[]) => {
		const accountId = await confirm()

		if (!accountId) {
			return toast.error('Please select an account to continue.')
		}

		const dataWithAccount = values.map(value => ({
			...value,
			accountId: accountId as string,
		}))

		bulkCreateTransactions.mutate(dataWithAccount, {
			onSuccess: () => {
				onCancelImport()
			},
		})
	}

	const { onOpen } = useNewTransaction()

	const { data, isLoading } = useGetTransactions()

	const transactions = data || []

	const deleteTransactions = useBulkDeleteTransactions()

	const isDisabled = isLoading || deleteTransactions.isPending

	const [ConfirmMarkDialog, confirmMark] = useConfirm(
		'Are you sure?',
		'This action cannot be undone.'
	)

	const editTransactions = useBulkMarkAsExpense()

	const { onOpen: onOpenEditTransactionCategory } = useOpenEditCategory()

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
						onOpenEditTransactionCategory(ids)
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
		return (
			<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
				<Card className='border-none drop-shadow-sm'>
					<CardHeader>
						<Skeleton className='h-8 w-48' />
					</CardHeader>
					<CardContent>
						<div className='flex h-[500px] w-full items-center justify-center'>
							<Loader2 className='size-6 animate-spin text-slate-300' />
						</div>
					</CardContent>
				</Card>
			</section>
		)
	}

	if (variant === VARIANTS.IMPORT) {
		return (
			<>
				<SelectAccountDialog />
				<ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
			</>
		)
	}

	return (
		<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
			<ConfirmMarkDialog />
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
					<DataTable
						columns={TableColumns}
						data={transactions}
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
	)
}

export default TransactionsPage
