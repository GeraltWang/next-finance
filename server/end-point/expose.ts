import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { Bindings, Variables } from '@/server/env'
import prisma from '@/lib/prisma'
import { TransactionFastSchema } from '@/features/transactions/schemas'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
	.get('/', async c => {
		const token = c.req.header('Authorization')
		const user = c.get('jwtPayload')

		return c.json({ data: { token, user: user }, message: 'Hello from exposed api' })
	})
	.get('/accounts', async c => {
		const { id } = c.get('jwtPayload')

		const accounts = await prisma.account.findMany({
			where: {
				userId: id,
			},
			select: {
				id: true,
				name: true,
			},
		})

		return c.json({ data: accounts })
	})
	.get('/categories', async c => {
		const { id } = c.get('jwtPayload')

		const categories = await prisma.category.findMany({
			where: {
				userId: id,
			},
			select: {
				id: true,
				name: true,
			},
		})

		return c.json({ data: categories })
	})
	.post('/add-transaction', zValidator('json', TransactionFastSchema), async c => {
		const values = c.req.valid('json')

		const user = c.get('jwtPayload')

		const created = await prisma.transaction.create({
			data: {
				...values,
				date: new Date(),
			},
		})

		return c.json({ data: { uId: user.id, tId: created.id }, message: 'transaction created' })
	})

export default app
