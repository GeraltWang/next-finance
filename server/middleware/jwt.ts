import type { Bindings, Variables } from '@/server/env'
import prisma from '@/lib/prisma'

import { createMiddleware } from 'hono/factory'
import { env } from 'hono/adapter'
import { verify as verifyJwt } from 'hono/jwt'
import { HTTPException } from 'hono/http-exception'

/**
 * Middleware specific for JWT token verification, user can access api routes starts with /api/expose/*.
 */
const jwtMiddleware = createMiddleware<{ Bindings: Bindings; Variables: Variables }>(
	async (c, next) => {
		const auth = c.req.header('Authorization')
		const token = auth?.split(' ')[1]

		if (!token) {
			console.log(
				`------ JWT middleware: Authorization token is missing or invalid token format. ------`
			)
			throw new HTTPException(401, { message: 'Authorization token is missing' })
		}

		const { JWT_SECRET } = env(c)

		let user: Variables['JWT']

		try {
			user = (await verifyJwt(token, JWT_SECRET)) as Variables['JWT']
		} catch (error) {
			console.log(`------ JWT middleware: Authorization token validation failed. ------`)
			throw new HTTPException(401, { message: 'Invalid authorization token', cause: error })
		}

		if (!user || !user?.id || !user?.email) {
			console.log(`------ JWT middleware: Authorization token does not have necessary info. ------`)
			throw new HTTPException(401, { message: 'Unauthorized' })
		}

		const existingUser = await prisma.user.findUnique({
			where: {
				id: user.id,
			},
			select: {
				id: true,
				email: true,
			},
		})

		if (!existingUser) {
			console.log(`------ JWT middleware: user with id: ${user.id} does not exist in db. ------`)
			throw new HTTPException(401, { message: 'Unauthorized' })
		}

		c.set('JWT', existingUser)

		await next()
	}
)

export default jwtMiddleware
