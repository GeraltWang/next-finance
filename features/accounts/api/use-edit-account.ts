import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.accounts)[':id']['$patch']>

type RequestType = InferRequestType<(typeof client.api.accounts)[':id']['$patch']>['json']

export const useEditAccount = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async json => {
			const response = await client.api.accounts[':id']['$patch']({
				param: { id },
				json,
			})
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Account edited successfully')
			// 刷新 account 和 accounts 查询
			queryClient.invalidateQueries({
				queryKey: ['account', { id }],
			})
			queryClient.invalidateQueries({
				queryKey: ['accounts'],
			})
			// TODO: 刷新 summary 和 transactions
		},
		onError: () => {
			toast.error('Failed to edit account')
		},
	})

	return mutation
}
