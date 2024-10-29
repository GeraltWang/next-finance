import { createMiddleware } from 'hono/factory'
import { env } from 'hono/adapter'
import { verify as verifyJwt } from 'hono/jwt'
import type { Bindings, Variables } from '@/server/env'
import prisma from '@/lib/prisma'

const jwtMiddleware = createMiddleware<{ Bindings: Bindings; Variables: Variables }>(
	async (c, next) => {
		const auth = c.req.header('Authorization')
		const token = auth?.split(' ')[1]

		if (!token) {
			return c.json({ error: 'Authorization token is missing' }, 401)
		}

		const { JWT_SECRET } = env(c)

		let user

		try {
			user = await verifyJwt(token, JWT_SECRET)
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

		await next()
	}
)

export default jwtMiddleware
