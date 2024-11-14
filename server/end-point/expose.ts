import { TransactionFastSchema } from '@/features/transactions/schemas'
import prisma from '@/lib/prisma'
import { convertAmountToMiliunits } from '@/lib/utils'
import type { Bindings, Variables } from '@/server/env'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
	.get('/', async c => {
		const user = c.get('JWT')

		return c.json({ data: { user }, message: 'Hello from exposed api' })
	})
	.get('/accounts', async c => {
		const { id } = c.get('JWT')

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
		const { id } = c.get('JWT')

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

		const { id } = c.get('JWT')

		const existingAccount = await prisma.account.findFirst({
			where: {
				name: values.accountName,
				userId: id,
			},
		})

		const existingCategory = await prisma.category.findFirst({
			where: {
				name: values.categoryName,
				userId: id,
			},
		})

		if (!existingAccount) {
			throw new HTTPException(404, { message: `Account ${values.accountName} not found` })
		}

		if (!existingCategory) {
			throw new HTTPException(404, { message: `Category ${values.categoryName} not found` })
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

		return c.json({ data: { uId: id, tId: created.id }, message: 'expense created' })
	})

export default app
