import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.pat)[':id']['$delete']>

export const useDeletePat = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await client.api.pat[':id']['$delete']({
				param: { id },
			})
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Personal access token deleted successfully')
			// queryClient.invalidateQueries({
			// 	queryKey: ['pat', { id }],
			// })
			queryClient.invalidateQueries({
				queryKey: ['pats'],
			})
		},
		onError: () => {
			toast.error('Failed to delete personal access token')
		},
	})

	return mutation
}
