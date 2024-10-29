import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.accounts)['bulk-delete']['$post']>

type RequestType = InferRequestType<(typeof client.api.accounts)['bulk-delete']['$post']>['json']

export const useBulkDeleteAccounts = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.accounts['bulk-delete']['$post']({ json })

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Accounts deleted successfully')
			queryClient.invalidateQueries({
				queryKey: ['accounts'],
			})
			queryClient.invalidateQueries({
				queryKey: ['summary'],
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to delete accounts')
		},
	})

	return mutation
}
