import { RemoveUrlQueryParams, UrlQueryParams } from '@/types'
import qs from 'query-string'

export function formUrlQuery({ params, queryParams }: UrlQueryParams) {
	const currentUrl = qs.parse(params)

	// 合并新的查询参数
	Object.keys(queryParams).forEach(key => {
		currentUrl[key] = queryParams[key]
	})

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true, skipEmptyString: true }
	)
}

export function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
	const currentUrl = qs.parse(params)

	keysToRemove.forEach(key => {
		delete currentUrl[key]
	})

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true, skipEmptyString: true }
	)
}
