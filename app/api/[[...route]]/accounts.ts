import prisma from '@/prisma/client'
import { AccountSchema } from '@/schema/accounts'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

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
	.post('/bulk-delete', clerkMiddleware(), zValidator('json', z.object({ ids: z.array(z.string()) })), async c => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const values = c.req.valid('json')

		await prisma.account.deleteMany({
			where: {
				id: {
					in: values.ids,
				},
				userId: auth.userId,
			},
		})

		return c.json({ data: values.ids })
	})

export default app
