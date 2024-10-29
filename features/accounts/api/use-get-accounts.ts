import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'

export const useGetAccounts = () => {
	const query = useQuery({
		queryKey: ['accounts'],
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
