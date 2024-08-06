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
			// TODO: 刷新 summary 和 transactions
		},
		onError: () => {
			toast.error('Failed to delete category')
		},
	})

	return mutation
}
