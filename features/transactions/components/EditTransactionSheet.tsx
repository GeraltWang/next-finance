import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useDeleteAccount } from '@/features/accounts/api/use-delete-account'
import { useEditAccount } from '@/features/accounts/api/use-edit-account'
import { TransactionForm } from './TransactionForm'
import { useOpenTransaction } from '../hooks/use-open-transaction'
import { useConfirm } from '@/hooks/use-confirm'
import { TransactionSchema } from '@/schema/transactions'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetTransaction } from '../api/use-get-transaction'
import { useEditTransaction } from '../api/use-edit-transaction'

type FormValues = z.input<typeof TransactionSchema>

export const EditTransactionSheet = () => {
	const { isOpen, onClose, id } = useOpenTransaction()

	const transactionQuery = useGetTransaction(id)

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

	const isLoading = accountQuery.isLoading

	const defaultValues = transactionQuery.data

	const editMutation = useEditTransaction(id)

	const handleSubmit = (values: FormValues) => {
		editMutation.mutate(values, {
			onSuccess: () => {
				onClose()
			},
		})
	}

	const deleteMutation = useDeleteAccount(id)

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure?',
		'Your are about to delete this account and this action cannot be undone.'
	)

	const handleDelete = async () => {
		const ok = await confirm()
		if (ok) {
			deleteMutation.mutate(undefined, {
				onSuccess: () => {
					onClose()
				},
			})
		}
	}

	const isPending = editMutation.isPending || deleteMutation.isPending

	return (
		<>
			<ConfirmDialog />
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className='space-y-4'>
					<SheetHeader>
						<SheetTitle>Edit Account</SheetTitle>
						<SheetDescription>Edit account name.</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className='absolute inset-0 flex justify-center items-center'>
							<Loader2 className='size-6 text-slate-300 animate-spin' />
						</div>
					) : (
						<TransactionForm
							defaultValues={defaultValues}
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
		</>
	)
}
