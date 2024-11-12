import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

import summaryQueryFactory from '@/features/summary/lib/query-factory'
import categoriesQueryFactory from '@/features/categories/lib/query-factory'

type ResponseType = InferResponseType<(typeof client.api.categories)['bulk-delete']['$post']>

type RequestType = InferRequestType<(typeof client.api.categories)['bulk-delete']['$post']>['json']

export const useBulkDeleteCategories = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.categories['bulk-delete']['$post']({ json })

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Categories deleted successfully')
			queryClient.invalidateQueries({
				queryKey: categoriesQueryFactory.all(),
			})
			queryClient.invalidateQueries({
				queryKey: summaryQueryFactory.all(),
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to delete categories')
		},
	})

	return mutation
}
