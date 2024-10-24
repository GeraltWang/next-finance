import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { PatSchema } from '@/features/pat/schemas/index'
import { useNewPat } from '@/features/pat/hooks/use-new-pat'

type FormValues = z.infer<typeof PatSchema>

type Props = {
	id?: string
	defaultValues?: FormValues
	onSubmit: (values: FormValues) => void
	onDelete?: () => void
	disabled?: boolean
}

export const PatForm = ({ defaultValues, onSubmit, disabled }: Props) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(PatSchema),
		defaultValues,
	})

	const { onClose } = useNewPat()

	const handleSubmit = (values: FormValues) => {
		onSubmit(values)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					name={'name'}
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} disabled={disabled} placeholder='My test key' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='mt-4 flex flex-col-reverse pt-2 sm:flex-row sm:justify-end sm:space-x-2'>
					<Button variant={'outline'} type='button' onClick={onClose}>
						Cancel
					</Button>
					<Button disabled={disabled}>Confirm</Button>
				</div>
			</form>
		</Form>
	)
}
