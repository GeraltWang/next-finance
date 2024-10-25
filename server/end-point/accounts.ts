import prisma from '@/lib/prisma'
import { AccountSchema } from '@/features/accounts/schemas/index'
import { UserMeta } from '@/types'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { getUserByClerkUserId } from '@/features/auth/actions/user'

const app = new Hono()
	.get('/', clerkMiddleware(), async c => {
		const auth = getAuth(c)
		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}
		const userMeta = auth?.sessionClaims?.userMeta as UserMeta

		if (!userMeta?.userId) {
			const user = await getUserByClerkUserId(auth.userId)
			if (!user) {
				return c.json({ error: 'User not found' }, 401)
			}
			userMeta.userId = user.id
		}

		const data = await prisma.account.findMany({
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
			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta

			if (!userMeta?.userId) {
				const user = await getUserByClerkUserId(auth.userId)
				if (!user) {
					return c.json({ error: 'User not found' }, 401)
				}
				userMeta.userId = user.id
			}

			const values = c.req.valid('param')

			if (!values.id) {
				return c.json({ error: 'Missing Account ID' }, 400)
			}

			const data = await prisma.account.findUnique({
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
				return c.json({ error: 'Account not found' }, 404)
			}

			return c.json({ data })
		}
	)
	.post('/', clerkMiddleware(), zValidator('json', AccountSchema), async c => {
		const auth = getAuth(c)
		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}
		const userMeta = auth?.sessionClaims?.userMeta as UserMeta

		if (!userMeta?.userId) {
			const user = await getUserByClerkUserId(auth.userId)
			if (!user) {
				return c.json({ error: 'User not found' }, 401)
			}
			userMeta.userId = user.id
		}

		const values = c.req.valid('json')

		const data = await prisma.account.create({
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
			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta

			if (!userMeta?.userId) {
				const user = await getUserByClerkUserId(auth.userId)
				if (!user) {
					return c.json({ error: 'User not found' }, 401)
				}
				userMeta.userId = user.id
			}

			const values = c.req.valid('json')

			await prisma.account.deleteMany({
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
		zValidator('json', AccountSchema),
		async c => {
			const auth = getAuth(c)
			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta

			if (!userMeta?.userId) {
				const user = await getUserByClerkUserId(auth.userId)
				if (!user) {
					return c.json({ error: 'User not found' }, 401)
				}
				userMeta.userId = user.id
			}

			const values = c.req.valid('param')

			if (!values.id) {
				return c.json({ error: 'Missing Account ID' }, 400)
			}

			const body = c.req.valid('json')

			const existingAccount = await prisma.account.findUnique({
				where: {
					id: values.id,
					userId: userMeta.userId,
				},
			})

			if (!existingAccount) {
				return c.json({ error: 'Account not found' }, 404)
			}

			const data = await prisma.account.update({
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
			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}
			const userMeta = auth?.sessionClaims?.userMeta as UserMeta

			if (!userMeta?.userId) {
				const user = await getUserByClerkUserId(auth.userId)
				if (!user) {
					return c.json({ error: 'User not found' }, 401)
				}
				userMeta.userId = user.id
			}

			const values = c.req.valid('param')

			if (!values.id) {
				return c.json({ error: 'Missing Account ID' }, 400)
			}

			const existingAccount = await prisma.account.findUnique({
				where: {
					id: values.id,
					userId: userMeta.userId,
				},
			})

			if (!existingAccount) {
				return c.json({ error: 'Account not found' }, 404)
			}

			const data = await prisma.account.delete({
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
