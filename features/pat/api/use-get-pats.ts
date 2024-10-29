import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'

export const useGetPats = () => {
	const query = useQuery({
		queryKey: ['pats'],
		queryFn: async () => {
			const response = await client.api.pat.$get()

			if (!response.ok) {
				throw await handleErrors(response)
			}

			const { data } = await response.json()

			return data
		},
	})

	return query
}
