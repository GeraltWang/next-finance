// ====== USER PARAMS
export interface UserMeta {
	userId?: string
}

// ====== URL QUERY PARAMS
export interface UrlQueryParams {
	params: string
	queryParams: Record<string, any>
}

export interface RemoveUrlQueryParams {
	params: string
	keysToRemove: string[]
}

export interface SearchParamProps {
	params: { id: string }
	searchParams: { [key: string]: string | string[] | undefined }
}
