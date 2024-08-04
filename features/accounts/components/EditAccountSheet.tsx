import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { AccountForm } from '@/features/accounts/components/AccountForm'
import { AccountSchema } from '@/schema/accounts'
import { z } from 'zod'
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account'
import { useGetAccount } from '@/features/accounts/api/use-get-account'

type FormValues = z.input<typeof AccountSchema>

export const EditAccountSheet = () => {
	const { isOpen, onClose, id } = useOpenAccount()

	const accountQuery = useGetAccount(id)

	const defaultValues = accountQuery.data ? { name: accountQuery.data.name } : { name: '' }

	const mutation = useCreateAccount()

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
				<AccountForm defaultValues={defaultValues} onSubmit={handleSubmit} disabled={mutation.isPending} />
			</SheetContent>
		</Sheet>
	)
}
