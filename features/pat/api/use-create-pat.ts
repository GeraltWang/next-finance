import { handleErrors } from '@/lib/errors'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.pat)['generate-pat']['$post']>

type RequestType = InferRequestType<(typeof client.api.pat)['generate-pat']['$post']>['json']

export const useCreatePat = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.pat['generate-pat']['$post']({ json })
			if (!response.ok) {
				throw await handleErrors(response)
			}
			return await response.json()
		},
		onSuccess: () => {
			toast.success('New access token generated')
			queryClient.invalidateQueries({
				queryKey: ['pats'],
			})
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to generate access token')
		},
	})

	return mutation
}
