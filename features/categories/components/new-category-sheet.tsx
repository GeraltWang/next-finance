import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { CategoryForm } from '@/features/categories/components/category-form'
import { useNewCategory } from '@/features/categories/hooks/use-new-category'
import { CategorySchema } from '@/features/categories/schemas/index'
import { z } from 'zod'
import { useCreateCategory } from '@/features/categories/api/use-create-category'

type FormValues = z.input<typeof CategorySchema>

export const NewCategorySheet = () => {
	const { isOpen, onClose } = useNewCategory()

	const mutation = useCreateCategory()

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
					<SheetTitle>New Category</SheetTitle>
					<SheetDescription>Create a new category to organize your transactions.</SheetDescription>
				</SheetHeader>
				<CategoryForm
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
