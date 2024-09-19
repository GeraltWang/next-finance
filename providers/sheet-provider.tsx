'use client'
import { useMountedState } from 'react-use'
import { NewAccountSheet } from '@/features/accounts/components/NewAccountSheet'
import { EditAccountSheet } from '@/features/accounts/components/EditAccountSheet'
import { NewCategorySheet } from '@/features/categories/components/NewCategorySheet'
import { EditCategorySheet } from '@/features/categories/components/EditCategorySheet'
import { NewTransactionSheet } from '@/features/transactions/components/NewTransactionSheet'
import { EditTransactionSheet } from '@/features/transactions/components/EditTransactionSheet'
import { EditTransactionCategorySheet as BulkEditTransactionCategorySheet } from '@/features/transactions/components/EditTransactionCategorySheet'

export const SheetProvider = () => {
	const isMounted = useMountedState()

	if (!isMounted) {
		return null
	}

	return (
		<>
			<NewAccountSheet />
			<EditAccountSheet />
			<NewCategorySheet />
			<EditCategorySheet />
			<NewTransactionSheet />
			<EditTransactionSheet />
			<BulkEditTransactionCategorySheet />
		</>
	)
}
