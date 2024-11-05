'use client'

import { Suspense, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { useSelectAccount } from '@/features/accounts/hooks/use-select-account'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions'
import { ImportCard } from '@/features/transactions/components/import-card'
import { TransactionTable } from '@/features/transactions/components/transaction-table'
import { TransactionTableFallback } from '@/features/transactions/components/transaction-table-fallback'
import { TransactionSchema } from '@/features/transactions/schemas/index'

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
	const [SelectAccountDialog, confirm] = useSelectAccount<string>()

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
			accountId,
		}))

		bulkCreateTransactions.mutate(dataWithAccount, {
			onSuccess: () => {
				onCancelImport()
			},
		})
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
		<Suspense fallback={<TransactionTableFallback />}>
			<TransactionTable onUpload={onUpload} />
		</Suspense>
	)
}

export default TransactionsPage
