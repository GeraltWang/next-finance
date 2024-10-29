import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { Bindings, Variables } from '@/server/env'
import prisma from '@/lib/prisma'
import { convertAmountToMiliunits } from '@/lib/utils'
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
	.post('/add-expense', zValidator('json', TransactionFastSchema), async c => {
		const values = c.req.valid('json')

		const user = c.get('jwtPayload')

		const existingAccount = await prisma.account.findFirst({
			where: {
				name: values.accountName,
				userId: user.id,
			},
		})

		const existingCategory = await prisma.category.findFirst({
			where: {
				name: values.categoryName,
				userId: user.id,
			},
		})

		if (!existingAccount) {
			return c.json({ error: `Account ${values.accountName} not found` }, 404)
		}

		if (!existingCategory) {
			return c.json({ error: `Category ${values.categoryName} not found` }, 404)
		}

		const created = await prisma.transaction.create({
			data: {
				amount: convertAmountToMiliunits(values.amount) * -1,
				payee: values.payee,
				categoryId: existingCategory.id,
				accountId: existingAccount.id,
				date: new Date(),
			},
		})

		return c.json({ data: { uId: user.id, tId: created.id }, message: 'expense created' })
	})

export default app
