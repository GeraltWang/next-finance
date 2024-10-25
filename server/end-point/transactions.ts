import prisma from '@/lib/prisma'
import { TransactionSchema, TransactionUpdateSchema } from '@/features/transactions/schemas/index'
import { UserMeta } from '@/types'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import dayjs from 'dayjs'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
	.get(
		'/',
		clerkMiddleware(),
		zValidator(
			'query',
			z.object({
				from: z.string().optional(),
				to: z.string().optional(),
				page: z.string().optional(),
				pageSize: z.string().optional(),
				accountId: z.string().optional(),
			})
		),
		async c => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const { from, to, page, pageSize, accountId } = c.req.valid('query')

			const defaultTo = dayjs().utc().endOf('day').toDate()
			const defaultFrom = dayjs(defaultTo).utc().subtract(30, 'day').startOf('day').toDate()

			const startDate = from ? dayjs(from, 'YYYY-MM-DD').utc().startOf('day').toDate() : defaultFrom
			const endDate = to ? dayjs(to, 'YYYY-MM-DD').utc().endOf('day').toDate() : defaultTo

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
							userId: userMeta.userId,
						},
						date: {
							gte: startDate,
							lte: endDate,
						},
						...(accountId && { accountId: accountId }), // 如果 accountId 存在，则添加此条件
					},
					orderBy: {
						date: 'asc',
					},
				})

				return c.json({ data })
		}
)
	.get('/page', clerkMiddleware(),
		zValidator(
			'query',
			z.object({
				from: z.string().optional(),
				to: z.string().optional(),
				page: z.string().optional(),
				pageSize: z.string().optional(),
				accountId: z.string().optional(),
			})
		), async (c) => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const { from, to, page = 1, pageSize = 10, accountId } = c.req.valid('query')

			const defaultTo = dayjs().utc().endOf('day').toDate()
			const defaultFrom = dayjs(defaultTo).utc().subtract(30, 'day').startOf('day').toDate()

			const startDate = from ? dayjs(from, 'YYYY-MM-DD').utc().startOf('day').toDate() : defaultFrom
			const endDate = to ? dayjs(to, 'YYYY-MM-DD').utc().endOf('day').toDate() : defaultTo

			const skip = (+page - 1) * +pageSize
			const take = Number(pageSize)

			const totalCount = await prisma.transaction.count({
				where: {
					account: {
						userId: userMeta.userId,
					},
					date: {
						gte: startDate,
						lte: endDate,
					},
					...(accountId && { accountId: accountId }), // 如果 accountId 存在，则添加此条件
				},
			})

			const pageCount = Math.ceil(totalCount / take)

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
						userId: userMeta.userId,
					},
					date: {
						gte: startDate,
						lte: endDate,
					},
					...(accountId && { accountId: accountId }), // 如果 accountId 存在，则添加此条件
				},
				orderBy: {
					date: 'asc',
				},
				skip,
				take,
			})

			return c.json({ data, totalCount, page: Number(page), pageSize: take, pageCount })
		})
	.get(
		'/:id',
		clerkMiddleware(),
		zValidator('param', z.object({ id: z.string().optional() })),
		async c => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
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
						userId: userMeta.userId,
					},
				},
			})

			if (!data) {
				return c.json({ error: 'Transaction not found' }, 404)
			}

			return c.json({ data })
		}
	)
	.post('/', clerkMiddleware(), zValidator('json', TransactionSchema), async c => {
		const auth = getAuth(c)
		const userMeta = auth?.sessionClaims?.userMeta as UserMeta
		if (!userMeta?.userId) {
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
	.post(
		'/bulk-create',
		clerkMiddleware(),
		zValidator('json', z.array(TransactionSchema)),
		async c => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('json')

			const data = await prisma.transaction.createMany({
				data: values,
			})

			return c.json({ data: data.count })
		}
	)
	.post(
		'/bulk-delete',
		clerkMiddleware(),
		zValidator('json', z.object({ ids: z.array(z.string()) })),
		async c => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('json')

			await prisma.transaction.deleteMany({
				where: {
					id: {
						in: values.ids,
					},
					account: {
						userId: userMeta.userId,
					},
				},
			})

			return c.json({ data: values.ids })
		}
	)
	.patch(
		'/:id',
		clerkMiddleware(),
		zValidator('param', z.object({ id: z.string().optional() })),
		zValidator('json', TransactionSchema),
		async c => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
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
						userId: userMeta.userId,
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
	.post(
		'/bulk-edit',
		clerkMiddleware(),
		zValidator('json', z.object({ ids: z.array(z.string()), data: TransactionUpdateSchema })),
		async c => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('json')

			const existingData = await prisma.transaction.findMany({
				where: {
					id: {
						in: values.ids,
					},
					account: {
						userId: userMeta.userId,
					},
				},
			})

			const existingIds = existingData.map(data => data.id)

			await prisma.transaction.updateMany({
				where: {
					id: {
						in: existingIds,
					},
					account: {
						userId: userMeta.userId,
					},
				},
				data: values.data,
			})

			return c.json({ data: existingIds })
		}
	)
	.post(
		'/bulk-mark-as-expense',
		clerkMiddleware(),
		zValidator('json', z.object({ ids: z.array(z.string()) })),
		async c => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('json')

			const existingData = await prisma.transaction.findMany({
				where: {
					id: {
						in: values.ids,
					},
					account: {
						userId: userMeta.userId,
					},
					amount: {
						gt: 0,
					},
				},
			})

			const positiveIds = existingData.map(data => data.id)

			await prisma.transaction.updateMany({
				where: {
					id: {
						in: positiveIds,
					},
					account: {
						userId: userMeta.userId,
					},
				},
				data: {
					amount: {
						multiply: -1,
					},
				},
			})

			return c.json({ data: positiveIds })
		}
	)
	.delete(
		'/:id',
		clerkMiddleware(),
		zValidator('param', z.object({ id: z.string().optional() })),
		async c => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
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
						userId: userMeta.userId,
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
						userId: userMeta.userId,
					},
				},
				select: {
					id: true,
				},
			})

			return c.json({ data })
		}
	)

export default app
