import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'

export const useGetUserSyncStatus = () => {
	const query = useQuery({
		queryKey: ['user-sync-status'],
		queryFn: async () => {
			const response = await client.api.auth.$get()

			if (!response.ok) {
				throw await handleErrors(response)
			}

			const { data } = await response.json()

			return data
		},
		refetchInterval: query => {
			return query.state.data?.isSynced ? false : 1000
		},
		retry: failureCount => {
			return failureCount <= 10
		},
	})

	return query
}
