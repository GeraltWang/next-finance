import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.transactions)[':id']['$delete']>

export const useDeleteTransaction = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await client.api.transactions[':id']['$delete']({
				param: { id },
			})

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Transaction deleted successfully')
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
			toast.error(e.message || 'Failed to delete transaction')
		},
	})

	return mutation
}
