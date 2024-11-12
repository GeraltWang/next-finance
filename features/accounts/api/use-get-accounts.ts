import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'

import accountsQueryFactory from '@/features/accounts/lib/query-factory'

export const useGetAccounts = () => {
	const query = useQuery({
		queryKey: accountsQueryFactory.all(),
		queryFn: async () => {
			const response = await client.api.accounts.$get()

			if (!response.ok) {
				throw await handleErrors(response)
			}

			const { data } = await response.json()

			return data
		},
	})

	return query
}
