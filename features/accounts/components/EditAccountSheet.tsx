import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useGetAccount } from '@/features/accounts/api/use-get-account'
import { AccountForm } from '@/features/accounts/components/AccountForm'
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account'
import { AccountSchema } from '@/schema/accounts'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useEditAccount } from '@/features/accounts/api/use-edit-account'

type FormValues = z.input<typeof AccountSchema>

export const EditAccountSheet = () => {
	const { isOpen, onClose, id } = useOpenAccount()

	const accountQuery = useGetAccount(id)

	const isLoading = accountQuery.isLoading

	const defaultValues = accountQuery.data ? { name: accountQuery.data.name } : { name: '' }

	const mutation = useEditAccount(id)

	const handleSubmit = (values: FormValues) => {
		mutation.mutate(values, {
			onSuccess: () => {
				onClose()
			},
		})
	}

	return (
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
					<AccountForm id={id} defaultValues={defaultValues} onSubmit={handleSubmit} disabled={mutation.isPending} />
				)}
			</SheetContent>
		</Sheet>
	)
}
