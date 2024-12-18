import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useBulkEditTransactions } from '@/features/transactions/api/use-bulk-edit-transactions'
import type { ApiSchema } from '@/features/transactions/components/edit-category-form'
import { EditCategoryForm } from '@/features/transactions/components/edit-category-form'
import { useOpenEditCategory } from '@/features/transactions/hooks/use-open-edit-category'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

type FormValues = z.input<typeof ApiSchema>

export const EditTransactionCategorySheet = () => {
	const { isOpen, onClose, ids, table } = useOpenEditCategory()

	const categoryQuery = useGetCategories()
	const categoryMutation = useCreateCategory()
	const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
	const categoryOptions = (categoryQuery.data ?? []).map(category => ({
		label: category.name,
		value: category.id,
	}))

	const bulkEditMutation = useBulkEditTransactions()

	const defaultValues = { categoryId: '' }

	const isLoading = categoryQuery.isLoading

	const isPending = categoryMutation.isPending || bulkEditMutation.isPending

	const handleSubmit = (values: FormValues) => {
		bulkEditMutation.mutate(values, {
			onSuccess: () => {
				table?.resetRowSelection()
				onClose()
			},
		})
	}

	return (
		<>
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className='space-y-4'>
					<SheetHeader>
						<SheetTitle>Edit Transaction</SheetTitle>
						<SheetDescription>Edit an existing transaction.</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className='absolute inset-0 flex items-center justify-center'>
							<Loader2 className='size-6 animate-spin text-slate-300' />
						</div>
					) : (
						<EditCategoryForm
							ids={ids}
							defaultValues={defaultValues}
							onSubmit={handleSubmit}
							categoryOptions={categoryOptions}
							onCreateCategory={onCreateCategory}
							disabled={isPending}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	)
}
