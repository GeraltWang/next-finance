'use client'

import { DataTable } from '@/components/data-table'
import { LoadingSpinner } from '@/components/loading-spinner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useNewCategory } from '@/features/categories/hooks/use-new-category'
import { Plus } from 'lucide-react'
import { TableColumns } from '@/features/categories/components/table-columns'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories'

const CategoriesPage = () => {
	const { onOpen } = useNewCategory()

	const { data, isLoading } = useGetCategories()

	const categories = data || []

	const deleteCategories = useBulkDeleteCategories()

	const isDisabled = isLoading || deleteCategories.isPending

	if (isLoading) {
		return (
			<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
				<Card className='border-none drop-shadow-sm'>
					<CardHeader>
						<Skeleton className='h-8 w-48' />
					</CardHeader>
					<CardContent>
						<div className='flex h-[500px] w-full items-center justify-center'>
							<LoadingSpinner />
						</div>
					</CardContent>
				</Card>
			</section>
		)
	}

	return (
		<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='line-clamp-1 text-xl'>Categories</CardTitle>
					<Button size={'sm'} onClick={onOpen}>
						<Plus className='mr-2 size-4' />
						Add New Category
					</Button>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={TableColumns}
						data={categories}
						filterKey='name'
						disabled={isDisabled}
						onDelete={row => {
							const ids = row.map(r => r.original.id)
							deleteCategories.mutate({ ids })
						}}
					/>
				</CardContent>
			</Card>
		</section>
	)
}

export default CategoriesPage
