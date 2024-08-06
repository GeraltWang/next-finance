import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.categories)[':id']['$patch']>

type RequestType = InferRequestType<(typeof client.api.categories)[':id']['$patch']>['json']

export const useEditCategory = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.categories[':id']['$patch']({
				param: { id },
				json,
			})
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Category edited successfully')
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
			toast.error('Failed to edit category')
		},
	})

	return mutation
}
