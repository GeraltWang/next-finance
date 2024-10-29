import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'

export const useGetCategory = (id?: string) => {
	const query = useQuery({
		enabled: !!id,
		queryKey: ['category', { id }],
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
