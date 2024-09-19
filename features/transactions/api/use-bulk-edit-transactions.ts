import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.transactions)['bulk-edit']['$post']>

type RequestType = InferRequestType<(typeof client.api.transactions)['bulk-edit']['$post']>['json']

export const useBulkEditTransactions = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.transactions['bulk-edit']['$post']({ json })
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Transactions edited successfully')
			queryClient.invalidateQueries({
				queryKey: ['transactions'],
			})
			queryClient.invalidateQueries({
				queryKey: ['summary'],
			})
		},
		onError: () => {
			toast.error('Failed to edited transactions')
		},
	})

	return mutation
}
