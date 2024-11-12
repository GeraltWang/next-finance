import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'

import accountsQueryFactory from '@/features/accounts/lib/query-factory'

export const useGetAccount = (id?: string) => {
	const query = useQuery({
		enabled: !!id,
		queryKey: accountsQueryFactory.detail(id),
		queryFn: async () => {
			const response = await client.api.accounts[':id'].$get({
				param: { id },
			})

			if (!response.ok) {
				throw await handleErrors(response)
			}

			const { data } = await response.json()

			return data
		},
	})

	return query
}
