import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import { PatForm } from '@/features/pat/components/pat-form'
import { useNewPat } from '@/features/pat/hooks/use-new-pat'
import { useCreatePat } from '@/features/pat/api/use-create-pat'
import { PatSchema } from '@/features/pat/schemas/index'
import { z } from 'zod'

type FormValues = z.infer<typeof PatSchema>

export const NewPatDialog = () => {
	const { isOpen, onClose } = useNewPat()

	const mutation = useCreatePat()

	const handleSubmit = (values: FormValues) => {
		mutation.mutate(values, {
			onSuccess: () => {
				onClose()
			},
		})
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Generate new PAT</DialogTitle>
					<DialogDescription>
						Are you sure you want to generate a new PAT? Please keep it safe.
					</DialogDescription>
				</DialogHeader>
				<PatForm
					defaultValues={{
						name: '',
					}}
					onSubmit={handleSubmit}
					disabled={mutation.isPending}
				/>
			</DialogContent>
		</Dialog>
	)
}
