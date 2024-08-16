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
import { useConfirm } from '@/hooks/use-confirm'
import { TransactionSchema } from '@/schema/transactions'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction'
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction'
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'
import { TransactionForm } from '@/features/transactions/components/TransactionForm'

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

	const defaultValues = transactionQuery.data
		? {
				accountId: transactionQuery.data.accountId,
				categoryId: transactionQuery.data.categoryId,
				amount: transactionQuery.data.amount.toString(),
				date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
				payee: transactionQuery.data.payee,
				notes: transactionQuery.data.notes,
			}
		: {
				accountId: '',
				categoryId: '',
				amount: '',
				date: new Date(),
				payee: '',
				notes: '',
			}

	const editMutation = useEditTransaction(id)

	const handleSubmit = (values: FormValues) => {
		editMutation.mutate(values, {
			onSuccess: () => {
				onClose()
			},
		})
	}

	const deleteMutation = useDeleteTransaction(id)

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure?',
		'Your are about to delete this transaction and this action cannot be undone.'
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

	const isLoading = transactionQuery.isLoading || accountQuery.isLoading || categoryQuery.isLoading

	const isPending =
		editMutation.isPending ||
		deleteMutation.isPending ||
		transactionQuery.isLoading ||
		categoryMutation.isPending ||
		accountMutation.isPending

	return (
		<>
			<ConfirmDialog />
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className='space-y-4'>
					<SheetHeader>
						<SheetTitle>Edit Transaction</SheetTitle>
						<SheetDescription>Edit an existing transaction.</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className='absolute inset-0 flex items-center justify-center'>
							<Loader2 className='size-6 animate-spin text-slate-300' />
						</div>
					) : (
						<TransactionForm
							id={id}
							defaultValues={defaultValues}
							onSubmit={handleSubmit}
							categoryOptions={categoryOptions}
							accountOptions={accountOptions}
							onCreateCategory={onCreateCategory}
							onCreateAccount={onCreateAccount}
							onDelete={handleDelete}
							disabled={isPending}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	)
}
