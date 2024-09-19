import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	(typeof client.api.transactions)['bulk-mark-as-expense']['$post']
>

type RequestType = InferRequestType<
	(typeof client.api.transactions)['bulk-mark-as-expense']['$post']
>['json']

export const useBulkMarkAsExpense = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.transactions['bulk-mark-as-expense']['$post']({ json })
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
			toast.error('Failed to edit transactions')
		},
	})

	return mutation
}
