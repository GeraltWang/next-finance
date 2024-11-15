import prisma from '@/lib/prisma'
import type { Bindings, Variables } from '@/server/env'
import { currentUser } from '@clerk/nextjs/server'

import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

/**
 * Middleware to check if the request is authenticated.
 */
const authMiddleware = createMiddleware<{ Bindings: Bindings; Variables: Variables }>(
	async (c, next) => {
		const auth = await currentUser()

		if (!auth) {
			console.log(`------ Auth middleware: Unauthorized request access internal api. ------`)
			throw new HTTPException(401, { message: 'Unauthorized' })
		}

		const user = await prisma.user.findUnique({
			where: {
				clerkId: auth.id,
			},
			select: {
				id: true,
				email: true,
			},
		})

		if (!user) {
			console.log(
				`------ Auth middleware: User with clerkId: ${auth.id} does not exist in db. ------`
			)
			throw new HTTPException(401, { message: 'Unauthorized' })
		}

		c.set('USER', user)

		await next()
	}
)

export default authMiddleware
