import { TransactionSchema, TransactionUpdateSchema } from '@/features/transactions/schemas/index'
import prisma from '@/lib/prisma'
import type { Bindings, Variables } from '@/server/env'
import { myValidator } from '@/server/middleware/validator'

import dayjs from 'dayjs'
import { Hono } from 'hono'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
	.get(
		'/',
		myValidator(
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

			try {
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
				return c.json({ data })
			} catch (error) {
				throw new HTTPException(500, { message: 'Error querying transactions', cause: error })
			}
		}
	)
	.get(
		'/page',
		myValidator(
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
				throw new HTTPException(400, { message: 'Invalid to date format' })
			}

			const defaultTo = dayjs().utc().endOf('day').toDate()
			const defaultFrom = dayjs(defaultTo).utc().subtract(30, 'day').startOf('day').toDate()

			const startDate = from
				? dayjs(from, 'YYYY-MM-DD').utc(true).startOf('day').toDate()
				: defaultFrom
			const endDate = to ? dayjs(to, 'YYYY-MM-DD').utc(true).endOf('day').toDate() : defaultTo

			const take = Number(pageSize)

			try {
				// 首先获取总记录数
				const totalCount = await prisma.transaction.count({
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
				})

				// 计算总页数，至少为1
				const pageCount = Math.max(Math.ceil(totalCount / take), 1)

				// 将请求的页码与总页数比较，超出则调整
				let currentPage = Number(page)
				if (currentPage > pageCount) {
					currentPage = pageCount
				}

				const skip = (currentPage - 1) * take

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
				})

				const response = {
					data,
					totalCount,
					page: currentPage,
					pageSize: take,
					pageCount,
				}

				return c.json(response)
			} catch (error) {
				console.error('Error fetching transactions:', error)
				throw new HTTPException(500, { message: 'Error querying transactions', cause: error })
			}
		}
	)
	.get('/:id', myValidator('param', z.object({ id: z.string().optional() })), async c => {
		const user = c.get('USER')

		const values = c.req.valid('param')

		if (!values.id) {
			throw new HTTPException(400, { message: 'Missing Transaction ID' })
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
	.post('/', myValidator('json', TransactionSchema), async c => {
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
	.post('/bulk-create', myValidator('json', z.array(TransactionSchema)), async c => {
		const values = c.req.valid('json')

		const data = await prisma.transaction.createMany({
			data: values,
		})

		return c.json({ data: data.count })
	})
	.post('/bulk-delete', myValidator('json', z.object({ ids: z.array(z.string()) })), async c => {
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
		myValidator('param', z.object({ id: z.string().optional() })),
		myValidator('json', TransactionSchema),
		async c => {
			const user = c.get('USER')

			const values = c.req.valid('param')

			if (!values.id) {
				throw new HTTPException(400, { message: 'Missing Transaction ID' })
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
		myValidator('json', z.object({ ids: z.array(z.string()), data: TransactionUpdateSchema })),
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
		myValidator('json', z.object({ ids: z.array(z.string()) })),
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
	.delete('/:id', myValidator('param', z.object({ id: z.string().optional() })), async c => {
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
