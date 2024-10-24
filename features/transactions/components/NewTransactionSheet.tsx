import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction'
import { TransactionForm } from '@/features/transactions/components/TransactionForm'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { TransactionSchema } from '@/features/transactions/schemas/index'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

type FormValues = z.input<typeof TransactionSchema>

export const NewTransactionSheet = () => {
	const { isOpen, onClose } = useNewTransaction()

	const transactionMutation = useCreateTransaction()

	const accountQuery = useGetAccounts()
	const accountMutation = useCreateAccount()
	const onCreateAccount = (name: string) => accountMutation.mutate({ name })
	const accountOptions = (accountQuery.data ?? []).map(account => ({
		label: account.name,
		value: account.id,
	}))

	const categoryQuery = useGetCategories()
	const categoryMutation = useCreateCategory()
	const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
	const categoryOptions = (categoryQuery.data ?? []).map(category => ({
		label: category.name,
		value: category.id,
	}))

	const isPending =
		transactionMutation.isPending || accountMutation.isPending || categoryMutation.isPending

	const isLoading = accountQuery.isLoading || categoryQuery.isLoading

	const handleSubmit = (values: FormValues) => {
		transactionMutation.mutate(values, {
			onSuccess: () => {
				onClose()
			},
		})
	}

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent className='space-y-4'>
				<SheetHeader>
					<SheetTitle>New Transaction</SheetTitle>
					<SheetDescription>Add a new transaction.</SheetDescription>
				</SheetHeader>
				{isLoading ? (
					<div className='absolute inset-0 flex items-center justify-center'>
						<Loader2 className='size-6 animate-spin text-slate-300' />
					</div>
				) : (
					<TransactionForm
						onSubmit={handleSubmit}
						categoryOptions={categoryOptions}
						accountOptions={accountOptions}
						onCreateCategory={onCreateCategory}
						onCreateAccount={onCreateAccount}
						disabled={isPending}
					/>
				)}
			</SheetContent>
		</Sheet>
	)
}
