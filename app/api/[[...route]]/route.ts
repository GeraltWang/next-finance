import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import { verify as verifyJwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'

import accounts from './accounts'
import categories from './categories'
import transactions from './transactions'
import summary from './summary'
import webhook from './webhook'
import pat from './pat'
import expose from './expose'

import prisma from '@/prisma/client'

// export const runtime = 'edge'

type Variables = JwtVariables<{ id: string, email: string }>

const app = new Hono<{ Variables: Variables }>()
	.use(logger())
	.basePath('/api')
	.use('/pat/*', cors())
	.use('/expose/*', cors())
	.use(
		'/expose/*',
		async (c, next) => {
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
		}
	)

const routes = app
	.route('/accounts', accounts)
	.route('/categories', categories)
	.route('/transactions', transactions)
	.route('/summary', summary)
	.route('/webhook', webhook)
	.route('/pat', pat)
	.route('/expose', expose)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
