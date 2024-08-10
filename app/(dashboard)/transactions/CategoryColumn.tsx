import { useOpenCategory } from '@/features/categories/hooks/use-open-category'
import { TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'

type Props = {
	id: string
	category?: string
	categoryId?: string | null
}

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
	const { onOpen: onOpenCategory } = useOpenCategory()

	const { onOpen: onOpenTransaction } = useOpenTransaction()

	const onClick = () => {
		if (categoryId) {
			onOpenCategory(categoryId)
		} else {
			onOpenTransaction(id)
		}
	}

	return (
		<div
			className={cn('flex items-center cursor-pointer hover:underline', !category && 'text-rose-500')}
			onClick={onClick}
		>
			{!category && <TriangleAlert className='mr-2 size-4 shrink-0' />}
			{category || 'Uncategorized'}
		</div>
	)
}
