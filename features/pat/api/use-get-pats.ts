import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'

export const useGetPats = () => {
	const query = useQuery({
		queryKey: ['pats'],
		queryFn: async () => {
			const response = await client.api.pat.$get()

			if (!response.ok) {
				throw new Error('Failed to fetch')
			}

			const { data } = await response.json()

			return data
		},
	})

	return query
}
