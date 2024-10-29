import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetTransaction = (id?: string) => {
	const query = useQuery({
		enabled: !!id,
		queryKey: ['transaction', { id }],
		queryFn: async () => {
			const response = await client.api.transactions[':id'].$get({
				param: { id },
			})

			if (!response.ok) {
				throw await handleErrors(response)
			}

			const { data } = await response.json()

			return {
				...data,
				amount: convertAmountFromMiliunits(data.amount),
			}
		},
	})

	return query
}
