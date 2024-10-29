import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import type { Bindings, Variables } from '@/server/env'
import jwtMiddleware from '@/server/middleware/jwt'
import accounts from '@/server/end-point/accounts'
import categories from '@/server/end-point/categories'
import transactions from '@/server/end-point/transactions'
import summary from '@/server/end-point/summary'
import webhook from '@/server/end-point/webhook'
import pat from '@/server/end-point/pat'
import expose from '@/server/end-point/expose'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
	.basePath('/api')
	.use(logger())
	.use('/pat/*', cors())
	.use('/expose/*', cors())
	.use('/expose/*', jwtMiddleware)

const routes = app
	.route('/accounts', accounts)
	.route('/categories', categories)
	.route('/transactions', transactions)
	.route('/summary', summary)
	.route('/webhook', webhook)
	.route('/pat', pat)
	.route('/expose', expose)

export type AppType = typeof routes
export default app
