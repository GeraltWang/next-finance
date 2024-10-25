import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TransactionSchema } from '@/features/transactions/schemas/index'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { DatePicker } from '@/components/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { CommonSelect } from '@/components/common-select'
import { AmountInput } from '@/components/amount-input'

import { Trash } from 'lucide-react'
import { convertAmountToMiliunits } from '@/lib/utils'

const formSchema = z.object({
	date: z.coerce.date(),
	accountId: z.string(),
	categoryId: z.string().nullable().optional(),
	payee: z.string(),
	amount: z.string(),
	notes: z.string().nullable().optional(),
})

const apiSchema = TransactionSchema

type FormValues = z.input<typeof formSchema>

type ApiFormValues = z.input<typeof apiSchema>

type Props = {
	id?: string
	defaultValues?: FormValues
	onSubmit: (values: ApiFormValues) => void
	onDelete?: () => void
	disabled?: boolean
	categoryOptions: { label: string; value: string }[]
	accountOptions: { label: string; value: string }[]
	onCreateCategory: (name: string) => void
	onCreateAccount: (name: string) => void
}

export const TransactionForm = ({
	id,
	defaultValues,
	onSubmit,
	onDelete,
	disabled,
	accountOptions,
	categoryOptions,
	onCreateAccount,
	onCreateCategory,
}: Props) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	})

	const handleSubmit = (values: FormValues) => {
		const amount = parseFloat(values.amount)
		const amountInMiliunits = convertAmountToMiliunits(amount)
		onSubmit({
			...values,
			amount: amountInMiliunits,
		})
	}

	const handleDelete = () => {
		onDelete?.()
	}
	return (
		<Form {...form}>
			<form className='space-y-4 pt-4' onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					name={'date'}
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<DatePicker value={field.value} onChange={field.onChange} disabled={disabled} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name={'accountId'}
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Account</FormLabel>
							<FormControl>
								<CommonSelect
									value={field.value}
									options={accountOptions}
									onCreate={onCreateAccount}
									onChange={field.onChange}
									disabled={disabled}
									placeholder='Select an account'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
				<FormField
					name={'payee'}
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Payee</FormLabel>
							<FormControl>
								<Input {...field} disabled={disabled} placeholder='Add a payee' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name={'amount'}
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<AmountInput {...field} disabled={disabled} placeholder='0.00' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name={'notes'}
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									value={field.value ?? ''}
									disabled={disabled}
									placeholder='Notes is optional'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className='w-full' disabled={disabled}>
					{id ? 'Save Changes' : 'Add Transaction'}
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
						Delete Transaction
					</Button>
				)}
			</form>
		</Form>
	)
}
