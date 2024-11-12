import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

import summaryQueryFactory from '@/features/summary/lib/query-factory'
import transactionsQueryFactory from '@/features/transactions/lib/query-factory'

type ResponseType = InferResponseType<(typeof client.api.transactions)['bulk-delete']['$post']>

type RequestType = InferRequestType<
	(typeof client.api.transactions)['bulk-delete']['$post']
>['json']

export const useBulkDeleteTransactions = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.transactions['bulk-delete']['$post']({ json })

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Transactions deleted successfully')
			queryClient.invalidateQueries({
				queryKey: transactionsQueryFactory.page(),
			})
			queryClient.invalidateQueries({
				queryKey: summaryQueryFactory.all(),
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to delete transactions')
		},
	})

	return mutation
}
