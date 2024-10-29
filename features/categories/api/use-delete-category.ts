import { handleErrors } from '@/lib/errors'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

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
				queryKey: ['category', { id }],
			})
			queryClient.invalidateQueries({
				queryKey: ['categories'],
			})
			queryClient.invalidateQueries({
				queryKey: ['transactions'],
			})
			queryClient.invalidateQueries({
				queryKey: ['summary'],
			})
		},
		onError: (e) => {
			toast.error(e.message || 'Failed to delete category')
		},
	})

	return mutation
}
