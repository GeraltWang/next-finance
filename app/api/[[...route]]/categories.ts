import prisma from '@/prisma/client'
import { CategorySchema } from '@/schema/categories'
import { UserMeta } from '@/types'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
	.get('/', clerkMiddleware(), async c => {
		const auth = getAuth(c)
		const userMeta = auth?.sessionClaims?.userMeta as UserMeta
		if (!userMeta?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const data = await prisma.category.findMany({
			select: {
				id: true,
				name: true,
			},
			where: {
				userId: userMeta.userId,
			},
		})
		return c.json({ data })
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
				return c.json({ error: 'Missing Category ID' }, 400)
			}

			const data = await prisma.category.findUnique({
				where: {
					id: values.id,
					userId: userMeta.userId,
				},
				select: {
					id: true,
					name: true,
				},
			})

			if (!data) {
				return c.json({ error: 'Category not found' }, 404)
			}

			return c.json({ data })
		}
	)
	.post('/', clerkMiddleware(), zValidator('json', CategorySchema), async c => {
		const auth = getAuth(c)
		const userMeta = auth?.sessionClaims?.userMeta as UserMeta
		if (!userMeta?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const values = c.req.valid('json')

		const data = await prisma.category.create({
			data: {
				...values,
				userId: userMeta.userId,
			},
			select: {
				id: true,
				name: true,
			},
		})

		return c.json({ data })
	})
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

			await prisma.category.deleteMany({
				where: {
					id: {
						in: values.ids,
					},
					userId: userMeta.userId,
				},
			})

			return c.json({ data: values.ids })
		}
	)
	.patch(
		'/:id',
		clerkMiddleware(),
		zValidator('param', z.object({ id: z.string().optional() })),
		zValidator('json', CategorySchema),
		async c => {
			const auth = getAuth(c)
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta
			if (!userMeta?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('param')

			if (!values.id) {
				return c.json({ error: 'Missing Category ID' }, 400)
			}

			const body = c.req.valid('json')

			const existingCategory = await prisma.category.findUnique({
				where: {
					id: values.id,
					userId: userMeta.userId,
				},
			})

			if (!existingCategory) {
				return c.json({ error: 'Category not found' }, 404)
			}

			const data = await prisma.category.update({
				where: {
					id: values.id,
					userId: userMeta.userId,
				},
				data: body,
				select: {
					id: true,
					name: true,
				},
			})

			return c.json({ data })
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
				return c.json({ error: 'Missing Category ID' }, 400)
			}

			const existingCategory = await prisma.category.findUnique({
				where: {
					id: values.id,
					userId: userMeta.userId,
				},
			})

			if (!existingCategory) {
				return c.json({ error: 'Category not found' }, 404)
			}

			const data = await prisma.category.delete({
				where: {
					id: values.id,
					userId: userMeta.userId,
				},
				select: {
					id: true,
				},
			})

			return c.json({ data })
		}
	)

export default app
