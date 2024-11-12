/**
 * Transactions query factory which manage all query keys related to transactions api
 */
const transactionsQueryFactory = {
	/**
	 * Get all transactions
	 */
	all: (params?: Partial<{ from: string; to: string; accountId: string }>) =>
		params ? ['transactions', params] : ['transactions'],
	/**
	 * Get transactions paged
	 */
	page: (
		params?: Partial<{
			from: string
			to: string
			page: string
			pageSize: string
			accountId: string
		}>
	) =>
		params
			? [...transactionsQueryFactory.all(), 'page', params]
			: [...transactionsQueryFactory.all(), 'page'],
	/**
	 * Get transaction detail by id
	 */
	detail: (id?: string) =>
		id
			? [...transactionsQueryFactory.all(), 'detail', { id }]
			: [...transactionsQueryFactory.all(), 'detail'],
}

export default transactionsQueryFactory
