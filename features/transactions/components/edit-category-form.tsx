import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TransactionUpdateSchema } from '@/features/transactions/schemas/index'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { CommonSelect } from '@/components/common-select'

type FormValues = z.input<typeof TransactionUpdateSchema>

export const ApiSchema = z.object({
	ids: z.array(z.string()),
	data: TransactionUpdateSchema,
})

type ApiFormValues = z.input<typeof ApiSchema>

type Props = {
	ids?: string[]
	disabled?: boolean
	defaultValues: FormValues
	categoryOptions: { label: string; value: string }[]
	onCreateCategory: (name: string) => void
	onSubmit: (values: ApiFormValues) => void
}

export const EditCategoryForm = ({
	ids,
	disabled,
	defaultValues,
	categoryOptions,
	onCreateCategory,
	onSubmit,
}: Props) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(TransactionUpdateSchema),
		defaultValues,
	})

	const handleSubmit = (values: FormValues) => {
		if (!ids) return
		onSubmit({
			ids,
			data: values,
		})
	}

	return (
		<Form {...form}>
			<form className='space-y-4 pt-4' onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					name={'categoryId'}
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<FormControl>
								<CommonSelect
									value={field.value}
									options={categoryOptions}
									onCreate={onCreateCategory}
									onChange={field.onChange}
									disabled={disabled}
									placeholder='Select a category'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className='w-full' disabled={disabled}>
					Save
				</Button>
			</form>
		</Form>
	)
}
