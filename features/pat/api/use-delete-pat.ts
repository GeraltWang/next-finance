import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

import patsQueryFactory from '@/features/pat/lib/query-factory'

type ResponseType = InferResponseType<(typeof client.api.pat)[':id']['$delete']>

export const useDeletePat = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await client.api.pat[':id']['$delete']({
				param: { id },
			})

			if (!response.ok) {
				throw await handleErrors(response)
			}

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Personal access token deleted successfully')
			queryClient.invalidateQueries({
				queryKey: patsQueryFactory.all(),
			})
		},
		onError: e => {
			toast.error(e.message || 'Failed to delete personal access token')
		},
	})

	return mutation
}
