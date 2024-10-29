import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof client.api.categories.$post>

type RequestType = InferRequestType<typeof client.api.categories.$post>['json']

export const useCreateCategory = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.categories.$post({ json })

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Category created successfully')
			queryClient.invalidateQueries({
				queryKey: ['categories'],
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to create category')
		},
	})

	return mutation
}
