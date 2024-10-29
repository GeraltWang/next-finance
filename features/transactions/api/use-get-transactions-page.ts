import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useSearchParams } from 'next/navigation'
import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetTransactionsPage = () => {
	const params = useSearchParams()

	const from = params.get('from') || ''
	const to = params.get('to') || ''

	const page = params.get('page') ?? '1'
	const pageSize = params.get('pageSize') ?? '10'

	const accountId = params.get('accountId') || ''

	const query = useQuery({
		queryKey: ['transactions', { from, to, page, pageSize, accountId }],
		queryFn: async () => {
			const response = await client.api.transactions['page'].$get({
				query: {
					from,
					to,
					page,
					pageSize,
					accountId,
				},
			})

			if (!response.ok) {
				throw await handleErrors(response)
			}

			const res = await response.json()

			return {
				...res,
				data: res.data.map(transaction => ({
					...transaction,
					amount: convertAmountFromMiliunits(transaction.amount),
				})),
			}
		},
		placeholderData: keepPreviousData,
	})

	return query
}
