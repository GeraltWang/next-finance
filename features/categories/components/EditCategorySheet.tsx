import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useDeleteCategory } from '@/features/categories/api/use-delete-category'
import { useEditCategory } from '@/features/categories/api/use-edit-category'
import { useGetCategory } from '@/features/categories/api/use-get-category'
import { CategoryForm } from '@/features/categories/components/CategoryForm'
import { useOpenCategory } from '@/features/categories/hooks/use-open-category'
import { useConfirm } from '@/hooks/use-confirm'
import { CategorySchema } from '@/schema/categories'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

type FormValues = z.input<typeof CategorySchema>

export const EditCategorySheet = () => {
	const { isOpen, onClose, id } = useOpenCategory()

	const categoryQuery = useGetCategory(id)

	const isLoading = categoryQuery.isLoading

	const defaultValues = categoryQuery.data ? { name: categoryQuery.data.name } : { name: '' }

	const editMutation = useEditCategory(id)

	const handleSubmit = (values: FormValues) => {
		editMutation.mutate(values, {
			onSuccess: () => {
				onClose()
			},
		})
	}

	const deleteMutation = useDeleteCategory(id)

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure?',
		'Your are about to delete this category and this action cannot be undone.'
	)

	const handleDelete = async () => {
		const ok = await confirm()
		if (ok) {
			deleteMutation.mutate(undefined, {
				onSuccess: () => {
					onClose()
				},
			})
		}
	}

	const isPending = editMutation.isPending || deleteMutation.isPending

	return (
		<>
			<ConfirmDialog />
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className='space-y-4'>
					<SheetHeader>
						<SheetTitle>Edit Category</SheetTitle>
						<SheetDescription>Edit Category name.</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className='absolute inset-0 flex justify-center items-center'>
							<Loader2 className='size-6 text-slate-300 animate-spin' />
						</div>
					) : (
						<CategoryForm
							id={id}
							defaultValues={defaultValues}
							onSubmit={handleSubmit}
							onDelete={handleDelete}
							disabled={isPending}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	)
}