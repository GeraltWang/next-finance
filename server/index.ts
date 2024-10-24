import { Hono } from 'hono'
import { verify as verifyJwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import prisma from '@/lib/prisma'

import accounts from '@/server/end-point/accounts'
import categories from '@/server/end-point/categories'
import transactions from '@/server/end-point/transactions'
import summary from '@/server/end-point/summary'
import webhook from '@/server/end-point/webhook'
import pat from '@/server/end-point/pat'
import expose from '@/server/end-point/expose'

type Variables = JwtVariables<{ id: string; email: string }>

const app = new Hono<{ Variables: Variables }>()
	.basePath('/api')
	.use(logger())
	.use('/pat/*', cors())
	.use('/expose/*', cors())
	.use('/expose/*', async (c, next) => {
		const auth = c.req.header('Authorization')
		const token = auth?.split(' ')[1]

		if (!token) {
			return c.json({ error: 'Authorization token is missing' }, 401)
		}

		let user

		try {
			user = await verifyJwt(token, process.env.JWT_SECRET!)
		} catch (error) {
			return c.json({ error: 'Invalid authorization token' }, 401)
		}

		if (!user || !user?.id || !user?.email) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const existingUser = await prisma.user.findUnique({
			where: {
				id: user.id as string,
			},
		})

		if (!existingUser) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		c.set('jwtPayload', user)

		return await next()
	})

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
