import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'

import categoriesQueryFactory from '@/features/categories/lib/query-factory'

export const useGetCategory = (id?: string) => {
	const query = useQuery({
		enabled: !!id,
		queryKey: categoriesQueryFactory.detail(id),
		queryFn: async () => {
			const response = await client.api.categories[':id'].$get({
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
