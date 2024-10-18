export async function handleErrors(response: Response) {
	const errorResponse = await response.json()
	let errorMessage = 'server error' // default error message

	if (typeof errorResponse === 'object') {
		if ('error' in errorResponse) {
			errorMessage = errorResponse.error
		}
	}
	// console log the error
	console.log('----------', 'ERROR MESSAGE: ', errorMessage, 'FULL ERROR: ', errorResponse)

	if (response.status >= 500) {
		// return custom error message
		return new Error('Something went wrong')
	}

	// return the error message that comes from the server
	return new Error(errorMessage)
}
