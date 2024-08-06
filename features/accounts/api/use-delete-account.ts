import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.accounts)[':id']['$delete']>

export const useDeleteAccount = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await client.api.accounts[':id']['$delete']({
				param: { id },
			})
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Account deleted successfully')
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
			toast.error('Failed to delete account')
		},
	})

	return mutation
}
