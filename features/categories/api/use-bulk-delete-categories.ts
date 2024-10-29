import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

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
				queryKey: ['categories'],
			})
			queryClient.invalidateQueries({
				queryKey: ['summary'],
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to delete categories')
		},
	})

	return mutation
}
