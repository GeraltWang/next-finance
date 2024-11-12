import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

import summaryQueryFactory from '@/features/summary/lib/query-factory'
import transactionsQueryFactory from '@/features/transactions/lib/query-factory'
import accountsQueryFactory from '@/features/accounts/lib/query-factory'

type ResponseType = InferResponseType<(typeof client.api.accounts)[':id']['$delete']>

export const useDeleteAccount = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await client.api.accounts[':id']['$delete']({
				param: { id },
			})

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Account deleted successfully')
			// 刷新 account 和 accounts 查询
			queryClient.invalidateQueries({
				queryKey: accountsQueryFactory.detail(id),
			})
			queryClient.invalidateQueries({
				queryKey: accountsQueryFactory.all(),
			})
			queryClient.invalidateQueries({
				queryKey: transactionsQueryFactory.page(),
			})
			queryClient.invalidateQueries({
				queryKey: summaryQueryFactory.all(),
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to delete account')
		},
	})

	return mutation
}
