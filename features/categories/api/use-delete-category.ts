import { handleErrors } from '@/lib/errors'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

import summaryQueryFactory from '@/features/summary/lib/query-factory'
import transactionsQueryFactory from '@/features/transactions/lib/query-factory'
import categoriesQueryFactory from '@/features/categories/lib/query-factory'

type ResponseType = InferResponseType<(typeof client.api.categories)[':id']['$delete']>

export const useDeleteCategory = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await client.api.categories[':id']['$delete']({
				param: { id },
			})

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Category deleted successfully')
			// 刷新 category 和 categories 查询
			queryClient.invalidateQueries({
				queryKey: categoriesQueryFactory.detail(id),
			})
			queryClient.invalidateQueries({
				queryKey: categoriesQueryFactory.all(),
			})
			queryClient.invalidateQueries({
				queryKey: transactionsQueryFactory.page(),
			})
			queryClient.invalidateQueries({
				queryKey: summaryQueryFactory.all(),
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to delete category')
		},
	})

	return mutation
}
