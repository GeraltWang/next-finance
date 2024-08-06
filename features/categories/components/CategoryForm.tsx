import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CategorySchema } from '@/schema/categories'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Trash } from 'lucide-react'

type FormValues = z.input<typeof CategorySchema>

type Props = {
	id?: string
	defaultValues?: FormValues
	onSubmit: (values: FormValues) => void
	onDelete?: () => void
	disabled?: boolean
}

export const CategoryForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(CategorySchema),
		defaultValues,
	})

	const handleSubmit = (values: FormValues) => {
		onSubmit(values)
	}

	const handleDelete = () => {
		onDelete?.()
	}
	return (
		<Form {...form}>
			<form className='space-y-4 pt-4' onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					name={'name'}
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} disabled={disabled} placeholder='e.g. food, travel, etc.' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className='w-full' disabled={disabled}>
					{id ? 'Save Changes' : 'Create Category'}
				</Button>
				{!!id && (
					<Button
						className='w-full'
						type={'button'}
						size={'icon'}
						variant={'outline'}
						disabled={disabled}
						onClick={handleDelete}
					>
						<Trash className='size-4 mr-2' />
						Delete Category
					</Button>
				)}
			</form>
		</Form>
	)
}
