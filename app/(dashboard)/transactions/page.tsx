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
import { useState } from 'react'
import { UploadButton } from './UploadButton'
import { ImportCard } from './ImportCard'
import { TransactionSchema } from '@/schema/transactions'
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account'
import { toast } from 'sonner'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions'
import { z } from 'zod'

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
		console.log('🚀 ~ dataWithAccount ~ dataWithAccount:', dataWithAccount)

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

	if (variant === VARIANTS.IMPORT) {
		return (
			<>
				<SelectAccountDialog />
				<ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
			</>
		)
	}

	return (
		<section className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='text-xl line-clamp-1'>Transactions</CardTitle>
					<div className='flex items-center flex-col lg:flex-row gap-2'>
						<Button className='w-full lg:w-auto' size={'sm'} onClick={onOpen}>
							<Plus className='size-4 mr-2' />
							Add New Transaction
						</Button>
						<UploadButton onUpload={onUpload} />
					</div>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={transactions}
						filterKey='payee'
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
