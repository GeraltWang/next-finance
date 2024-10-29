import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.transactions)[':id']['$patch']>

type RequestType = InferRequestType<(typeof client.api.transactions)[':id']['$patch']>['json']

export const useEditTransaction = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.transactions[':id']['$patch']({
				param: { id },
				json,
			})

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Transaction edited successfully')
			queryClient.invalidateQueries({
				queryKey: ['transaction', { id }],
			})
			queryClient.invalidateQueries({
				queryKey: ['transactions'],
			})
			queryClient.invalidateQueries({
				queryKey: ['summary'],
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to edit transaction')
		},
	})

	return mutation
}
