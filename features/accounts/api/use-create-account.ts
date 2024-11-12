import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

import accountsQueryFactory from '@/features/accounts/lib/query-factory'

type ResponseType = InferResponseType<typeof client.api.accounts.$post>

type RequestType = InferRequestType<typeof client.api.accounts.$post>['json']

export const useCreateAccount = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.accounts.$post({ json })

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Account created successfully')
			queryClient.invalidateQueries({
				queryKey: accountsQueryFactory.all(),
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to create account')
		},
	})

	return mutation
}
