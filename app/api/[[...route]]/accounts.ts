import prisma from '@/prisma/client'
import { AccountSchema } from '@/schema/accounts'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

const app = new Hono()
	.get('/', clerkMiddleware(), async c => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const data = await prisma.account.findMany({
			select: {
				id: true,
				name: true,
			},
			where: {
				userId: auth.userId,
			},
		})
		return c.json({ data })
	})
	.post('/', clerkMiddleware(), zValidator('json', AccountSchema), async c => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const values = c.req.valid('json')

		const data = await prisma.account.create({
			data: {
				...values,
				userId: auth.userId,
			},
		})

		return c.json({ data })
	})

export default app
