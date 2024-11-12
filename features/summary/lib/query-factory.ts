/**
 * Summary query factory which manage all query keys related to summary api
 */
const summaryQueryFactory = {
	/**
	 * Get all summary
	 */
	all: (params?: Partial<{ from: string; to: string; accountId: string }>) =>
		params ? ['summary', params] : ['summary'],
}

export default summaryQueryFactory
