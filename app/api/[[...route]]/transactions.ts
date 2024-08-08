import prisma from '@/prisma/client'
import { TransactionSchema } from '@/schema/transactions'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { parse, subDays } from 'date-fns'

const app = new Hono()
	.get(
		'/',
		clerkMiddleware(),
		zValidator(
			'query',
			z.object({
				from: z.string().optional(),
				to: z.string().optional(),
				accountId: z.string().optional(),
			})
		),
		async c => {
			const auth = getAuth(c)

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const { from, to, accountId } = c.req.valid('query')

			const defaultTo = new Date()
			const defaultFrom = subDays(defaultTo, 30)

			const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom
			const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo

			const data = await prisma.transaction.findMany({
				select: {
					id: true,
					date: true,
					category: {
						select: {
							name: true,
						},
					},
					categoryId: true,
					payee: true,
					amount: true,
					notes: true,
					account: {
						select: {
							id: true,
							name: true,
						},
					},
					accountId: true,
				},
				where: {
					account: {
						userId: auth.userId,
					},
					date: {
						gte: startDate,
						lte: endDate,
					},
					...(accountId && { accountId: accountId }), // 如果 accountId 存在，则添加此条件
				},
			})

			return c.json({ data })
		}
	)
	.get('/:id', clerkMiddleware(), zValidator('param', z.object({ id: z.string().optional() })), async c => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const values = c.req.valid('param')

		if (!values.id) {
			return c.json({ error: 'Missing Transaction ID' }, 400)
		}

		const data = await prisma.transaction.findUnique({
			select: {
				id: true,
				date: true,
				categoryId: true,
				payee: true,
				amount: true,
				notes: true,
				accountId: true,
			},
			where: {
				id: values.id,
				account: {
					userId: auth.userId,
				},
			},
		})

		if (!data) {
			return c.json({ error: 'Transaction not found' }, 404)
		}

		return c.json({ data })
	})
	.post('/', clerkMiddleware(), zValidator('json', TransactionSchema), async c => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const values = c.req.valid('json')

		const data = await prisma.transaction.create({
			data: {
				...values,
			},
			select: {
				id: true,
			},
		})

		return c.json({ data })
	})
	.post('bulk-create', clerkMiddleware(), zValidator('json', z.array(TransactionSchema)), async c => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const values = c.req.valid('json')

		const data = await prisma.transaction.createMany({
			data: values,
		})

		return c.json({ data: data.count })
	})
	.post('/bulk-delete', clerkMiddleware(), zValidator('json', z.object({ ids: z.array(z.string()) })), async c => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const values = c.req.valid('json')

		await prisma.transaction.deleteMany({
			where: {
				id: {
					in: values.ids,
				},
				account: {
					userId: auth.userId,
				},
			},
		})

		return c.json({ data: values.ids })
	})
	.patch(
		'/:id',
		clerkMiddleware(),
		zValidator('param', z.object({ id: z.string().optional() })),
		zValidator('json', TransactionSchema),
		async c => {
			const auth = getAuth(c)

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('param')

			if (!values.id) {
				return c.json({ error: 'Missing Transaction ID' }, 400)
			}

			const body = c.req.valid('json')

			const existingData = await prisma.transaction.findUnique({
				where: {
					id: values.id,
					account: {
						userId: auth.userId,
					},
				},
			})

			if (!existingData) {
				return c.json({ error: 'Transaction not found' }, 404)
			}

			const data = await prisma.transaction.update({
				where: {
					id: values.id,
				},
				data: body,
				select: {
					id: true,
				},
			})

			return c.json({ data })
		}
	)
	.delete('/:id', clerkMiddleware(), zValidator('param', z.object({ id: z.string().optional() })), async c => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const values = c.req.valid('param')

		if (!values.id) {
			return c.json({ error: 'Missing Transaction ID' }, 400)
		}

		const existingData = await prisma.transaction.findUnique({
			where: {
				id: values.id,
				account: {
					id: auth.userId,
				},
			},
		})

		if (!existingData) {
			return c.json({ error: 'Transaction not found' }, 404)
		}

		const data = await prisma.transaction.delete({
			where: {
				id: values.id,
				account: {
					id: auth.userId,
				},
			},
			select: {
				id: true,
			},
		})

		return c.json({ data })
	})

export default app
