import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
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

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Category edited successfully')
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
		onError: e => {
			toast.error(e.message || 'Failed to edit category')
		},
	})

	return mutation
}
