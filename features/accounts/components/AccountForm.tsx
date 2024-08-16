import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AccountSchema } from '@/schema/accounts'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'

import { Trash } from 'lucide-react'

type FormValues = z.input<typeof AccountSchema>

type Props = {
	id?: string
	defaultValues?: FormValues
	onSubmit: (values: FormValues) => void
	onDelete?: () => void
	disabled?: boolean
}

export const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(AccountSchema),
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
								<Input {...field} disabled={disabled} placeholder='e.g. cash bank credit' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className='w-full' disabled={disabled}>
					{id ? 'Save Changes' : 'Create Account'}
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
						<Trash className='mr-2 size-4' />
						Delete Account
					</Button>
				)}
			</form>
		</Form>
	)
}
