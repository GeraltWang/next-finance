import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { AccountForm } from '@/features/accounts/components/account-form'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'
import { AccountSchema } from '@/features/accounts/schemas/index'
import { z } from 'zod'

type FormValues = z.input<typeof AccountSchema>

export const NewAccountSheet = () => {
	const { isOpen, onClose } = useNewAccount()

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
					<SheetTitle>New Account</SheetTitle>
					<SheetDescription>Create a new account to track your transactions.</SheetDescription>
				</SheetHeader>
				<AccountForm
					defaultValues={{
						name: '',
					}}
					onSubmit={handleSubmit}
					disabled={mutation.isPending}
				/>
			</SheetContent>
		</Sheet>
	)
}
