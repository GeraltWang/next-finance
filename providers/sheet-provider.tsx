'use client'
import { useMountedState } from 'react-use'
import { NewAccountSheet } from '@/features/accounts/components/NewAccountSheet'
import { EditAccountSheet } from '@/features/accounts/components/EditAccountSheet'
import { NewCategorySheet } from '@/features/categories/components/NewCategorySheet'
import { EditCategorySheet } from '@/features/categories/components/EditCategorySheet'

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
		</>
	)
}
