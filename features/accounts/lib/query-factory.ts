/**
 * Accounts query factory which manage all query keys related to accounts api
 */
const accountsQueryFactory = {
	/**
	 * Get all accounts
	 */
	all: () => ['accounts'],
	/**
	 * Get account detail by id
	 */
	detail: (id?: string) =>
		id
			? [...accountsQueryFactory.all(), 'detail', { id }]
			: [...accountsQueryFactory.all(), 'detail'],
}

export default accountsQueryFactory
