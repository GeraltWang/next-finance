import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'

import categoriesQueryFactory from '@/features/categories/lib/query-factory'

export const useGetCategories = () => {
	const query = useQuery({
		queryKey: categoriesQueryFactory.all(),
		queryFn: async () => {
			const response = await client.api.categories.$get()

			if (!response.ok) {
				throw await handleErrors(response)
			}

			const { data } = await response.json()

			return data
		},
	})

	return query
}
