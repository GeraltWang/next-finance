import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useDeleteAccount } from '@/features/accounts/api/use-delete-account'
import { useEditAccount } from '@/features/accounts/api/use-edit-account'
import { useGetAccount } from '@/features/accounts/api/use-get-account'
import { AccountForm } from '@/features/accounts/components/AccountForm'
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account'
import { useConfirm } from '@/hooks/use-confirm'
import { AccountSchema } from '@/features/accounts/schemas/index'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

type FormValues = z.input<typeof AccountSchema>

export const EditAccountSheet = () => {
	const { isOpen, onClose, id } = useOpenAccount()

	const accountQuery = useGetAccount(id)

	const isLoading = accountQuery.isLoading

	const defaultValues = accountQuery.data ? { name: accountQuery.data.name } : { name: '' }

	const editMutation = useEditAccount(id)

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
						<div className='absolute inset-0 flex items-center justify-center'>
							<Loader2 className='size-6 animate-spin text-slate-300' />
						</div>
					) : (
						<AccountForm
							id={id}
							defaultValues={defaultValues}
							onSubmit={handleSubmit}
							onDelete={handleDelete}
							disabled={isPending}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	)
}
