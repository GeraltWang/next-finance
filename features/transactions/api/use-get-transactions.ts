import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { handleErrors } from '@/lib/errors'
import { useSearchParams } from 'next/navigation'
import { convertAmountFromMiliunits } from '@/lib/utils'

import transactionsQueryFactory from '@/features/transactions/lib/query-factory'

export const useGetTransactions = () => {
	const params = useSearchParams()

	const from = params.get('from') || ''
	const to = params.get('to') || ''

	const accountId = params.get('accountId') || ''

	const query = useQuery({
		queryKey: transactionsQueryFactory.all({ from, to, accountId }),
		queryFn: async () => {
			const response = await client.api.transactions.$get({
				query: {
					from,
					to,
					accountId,
				},
			})

			if (!response.ok) {
				throw await handleErrors(response)
			}

			const res = await response.json()

			return res.data.map(transaction => ({
				...transaction,
				amount: convertAmountFromMiliunits(transaction.amount),
			}))
		},
	})

	return query
}
