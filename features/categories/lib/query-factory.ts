/**
 * Categories query factory which manage all query keys related to categories api
 */
const categoriesQueryFactory = {
	/**
	 * Get all categories
	 */
	all: () => ['categories'],
	/**
	 * Get category detail by id
	 */
	detail: (id?: string) =>
		id
			? [...categoriesQueryFactory.all(), 'detail', { id }]
			: [...categoriesQueryFactory.all(), 'detail'],
}

export default categoriesQueryFactory
