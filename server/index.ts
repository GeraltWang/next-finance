import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'

import authMiddleware from '@/server/middleware/auth'
import jwtMiddleware from '@/server/middleware/jwt'
import auth from '@/server/end-point/auth'
import accounts from '@/server/end-point/accounts'
import categories from '@/server/end-point/categories'
import transactions from '@/server/end-point/transactions'
import summary from '@/server/end-point/summary'
import webhook from '@/server/end-point/webhook'
import pat from '@/server/end-point/pat'
import expose from '@/server/end-point/expose'

const app = new Hono().basePath('/api').use(logger()).use('/expose/*', cors(), jwtMiddleware)

// 自定义中间件，根据路径决定是否调用 authMiddleware
app.use('*', async (c, next) => {
	const path = c.req.path

	const skipAuth =
		path.startsWith('/api/expose') ||
		path.startsWith('/api/webhook') ||
		path.startsWith('/api/auth')

	if (skipAuth) {
		// skip authMiddleware
		await next()
	} else {
		// authMiddleware
		await authMiddleware(c, next)
	}
})

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return c.json(
			{
				error: 'Server Error',
				message: err.message,
			},
			err.status
		)
	} else {
		console.error('----------', 'An unexpected error occurred', 'FULL ERROR: ', err)
		return c.json(
			{
				error: 'Unknown Error',
				message: 'An unexpected error occurred',
			},
			500
		)
	}
})

const routes = app
	.route('/auth', auth)
	.route('/accounts', accounts)
	.route('/categories', categories)
	.route('/transactions', transactions)
	.route('/summary', summary)
	.route('/webhook', webhook)
	.route('/pat', pat)
	.route('/expose', expose)

export type AppType = typeof routes
export default app
