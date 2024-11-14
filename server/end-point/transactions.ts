import { TransactionSchema, TransactionUpdateSchema } from '@/features/transactions/schemas/index'
import prisma from '@/lib/prisma'
import { zValidator } from '@hono/zod-validator'
import type { Bindings, Variables } from '@/server/env'

import dayjs from 'dayjs'
import { Hono } from 'hono'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
	.get(
		'/',
		zValidator(
			'query',
			z.object({
				from: z.string().optional(),
				to: z.string().optional(),
				accountId: z.string().optional(),
			})
		),
		async c => {
			const user = c.get('USER')

			const { from, to, accountId } = c.req.valid('query')

			// 验证日期格式
			if (from && !dayjs(from, 'YYYY-MM-DD', true).isValid()) {
				throw new HTTPException(400, { message: 'Invalid from date format' })
			}
			if (to && !dayjs(to, 'YYYY-MM-DD', true).isValid()) {
				throw new HTTPException(400, { message: 'invalid to date format' })
			}

			const defaultTo = dayjs().utc().endOf('day').toDate()
			const defaultFrom = dayjs(defaultTo).utc().subtract(30, 'day').startOf('day').toDate()

			const startDate = from
				? dayjs(from, 'YYYY-MM-DD').utc(true).startOf('day').toDate()
				: defaultFrom
			const endDate = to ? dayjs(to, 'YYYY-MM-DD').utc(true).endOf('day').toDate() : defaultTo

			let data

			try {
				data = await prisma.transaction.findMany({
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
							userId: user.id,
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
			} catch (error) {
				return c.json({ error: 'Error querying transactions' }, 500)
			}

			return c.json({ data })
		}
	)
	.get(
		'/page',
		zValidator(
			'query',
			z.object({
				from: z.string().optional(),
				to: z.string().optional(),
				accountId: z.string().optional(),
				page: z
					.string()
					.transform(val => parseInt(val, 10))
					.refine(val => !isNaN(val) && val > 0, { message: 'Invalid page number' })
					.optional()
					.default('1'),
				pageSize: z
					.string()
					.transform(val => parseInt(val, 10))
					.refine(val => !isNaN(val) && val > 0, { message: 'Invalid page size' })
					.optional()
					.default('10'),
			})
		),
		async c => {
			const user = c.get('USER')

			const { from, to, page, pageSize, accountId } = c.req.valid('query')

			// 验证日期格式
			if (from && !dayjs(from, 'YYYY-MM-DD', true).isValid()) {
				throw new HTTPException(400, { message: 'Invalid from date format' })
			}
			if (to && !dayjs(to, 'YYYY-MM-DD', true).isValid()) {
				throw new HTTPException(400, { message: 'invalid to date format' })
			}

			const defaultTo = dayjs().utc().endOf('day').toDate()
			const defaultFrom = dayjs(defaultTo).utc().subtract(30, 'day').startOf('day').toDate()

			const startDate = from
				? dayjs(from, 'YYYY-MM-DD').utc(true).startOf('day').toDate()
				: defaultFrom
			const endDate = to ? dayjs(to, 'YYYY-MM-DD').utc(true).endOf('day').toDate() : defaultTo

			const skip = (Number(page) - 1) * Number(pageSize)
			const take = Number(pageSize)

			let response

			try {
				const [data, totalCount] = await Promise.all([
					prisma.transaction.findMany({
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
								userId: user.id,
							},
							date: {
								gte: startDate,
								lte: endDate,
							},
							...(accountId && { accountId }),
						},
						orderBy: {
							date: 'asc',
						},
						skip,
						take,
					}),
					prisma.transaction.count({
						where: {
							account: {
								userId: user.id,
							},
							date: {
								gte: startDate,
								lte: endDate,
							},
							...(accountId && { accountId }),
						},
					}),
				])

				const pageCount = Math.ceil(totalCount / take)

				response = { data, totalCount, page: Number(page), pageSize: take, pageCount }
				return c.json(response)
			} catch (error) {
				console.error('Error fetching transactions:', error)
				throw new HTTPException(500, { message: 'Error querying transactions', cause: error })
			}
		}
	)
	.get('/:id', zValidator('param', z.object({ id: z.string().optional() })), async c => {
		const user = c.get('USER')

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
					userId: user.id,
				},
			},
		})

		if (!data) {
			throw new HTTPException(404, { message: 'Transaction not found' })
		}

		return c.json({ data })
	})
	.post('/', zValidator('json', TransactionSchema), async c => {
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
	.post('/bulk-create', zValidator('json', z.array(TransactionSchema)), async c => {
		const values = c.req.valid('json')

		const data = await prisma.transaction.createMany({
			data: values,
		})

		return c.json({ data: data.count })
	})
	.post('/bulk-delete', zValidator('json', z.object({ ids: z.array(z.string()) })), async c => {
		const user = c.get('USER')

		const values = c.req.valid('json')

		await prisma.transaction.deleteMany({
			where: {
				id: {
					in: values.ids,
				},
				account: {
					userId: user.id,
				},
			},
		})

		return c.json({ data: values.ids })
	})
	.patch(
		'/:id',
		zValidator('param', z.object({ id: z.string().optional() })),
		zValidator('json', TransactionSchema),
		async c => {
			const user = c.get('USER')

			const values = c.req.valid('param')

			if (!values.id) {
				return c.json({ error: 'Missing Transaction ID' }, 400)
			}

			const body = c.req.valid('json')

			const existingData = await prisma.transaction.findUnique({
				where: {
					id: values.id,
					account: {
						userId: user.id,
					},
				},
			})

			if (!existingData) {
				throw new HTTPException(404, { message: 'Transaction not found' })
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
		zValidator('json', z.object({ ids: z.array(z.string()), data: TransactionUpdateSchema })),
		async c => {
			const user = c.get('USER')

			const values = c.req.valid('json')

			const existingData = await prisma.transaction.findMany({
				where: {
					id: {
						in: values.ids,
					},
					account: {
						userId: user.id,
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
						userId: user.id,
					},
				},
				data: values.data,
			})

			return c.json({ data: existingIds })
		}
	)
	.post(
		'/bulk-mark-as-expense',
		zValidator('json', z.object({ ids: z.array(z.string()) })),
		async c => {
			const user = c.get('USER')

			const values = c.req.valid('json')

			const existingData = await prisma.transaction.findMany({
				where: {
					id: {
						in: values.ids,
					},
					account: {
						userId: user.id,
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
						userId: user.id,
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
	.delete('/:id', zValidator('param', z.object({ id: z.string().optional() })), async c => {
		const user = c.get('USER')

		const values = c.req.valid('param')

		if (!values.id) {
			throw new HTTPException(400, { message: 'Missing Transaction ID' })
		}

		const existingData = await prisma.transaction.findUnique({
			where: {
				id: values.id,
				account: {
					userId: user.id,
				},
			},
		})

		if (!existingData) {
			throw new HTTPException(404, { message: 'Transaction not found' })
		}

		const data = await prisma.transaction.delete({
			where: {
				id: values.id,
				account: {
					userId: user.id,
				},
			},
			select: {
				id: true,
			},
		})

		return c.json({ data })
	})

export default app
