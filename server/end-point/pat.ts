import { Hono } from 'hono'
import type { Bindings, Variables } from '@/server/env'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { sign as signJwt } from 'hono/jwt'
import { UserMeta } from '@/types'
import prisma from '@/lib/prisma'
import { zValidator } from '@hono/zod-validator'
import { PatSchema } from '@/features/pat/schemas/index'
import { z } from 'zod'

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()
	.get('/', clerkMiddleware(), async c => {
		const auth = getAuth(c)
		const userMeta = auth?.sessionClaims?.userMeta as UserMeta
		if (!userMeta?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const existingUser = await prisma.user.findUnique({
			where: {
				id: userMeta.userId,
			},
		})

		if (!existingUser) {
			return c.json({ error: 'User does not exist' }, 401)
		}

		const pats = await prisma.personalAccessToken.findMany({
			where: {
				userId: existingUser.id,
			},
		})

		return c.json({ data: pats })
	})
	.post('/generate-pat', clerkMiddleware(), zValidator('json', PatSchema), async c => {
		const auth = getAuth(c)
		const userMeta = auth?.sessionClaims?.userMeta as UserMeta
		if (!userMeta?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const values = c.req.valid('json')

		const existingUser = await prisma.user.findUnique({
			where: {
				id: userMeta.userId,
			},
			select: {
				id: true,
				email: true,
			}
		})

		if (!existingUser) {
			return c.json({ error: 'User does not exist' }, 401)
		}

		const payload = existingUser

		const JWT_SECRET = c.env.JWT_SECRET

		const token = await signJwt(payload, JWT_SECRET)

		const duplicateName = await prisma.personalAccessToken.findFirst({
			where: {
				userId: existingUser.id,
				name: values.name.toLowerCase(),
			},
		})

		if (duplicateName) {
			return c.json({ error: 'Pat with this name already exists' }, 400)
		}

		await prisma.personalAccessToken.create({
			data: {
				userId: existingUser.id,
				email: existingUser.email.toLowerCase(),
				name: values.name.toLowerCase(),
				token,
			},
		})

		return c.json({ data: { token } })
	})
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
				return c.json({ error: 'Missing ID' }, 400)
			}

			const existingUser = await prisma.user.findUnique({
				where: {
					id: userMeta.userId,
				}
			})

			if (!existingUser) {
				return c.json({ error: 'User does not exist' }, 401)
			}

			const patUserInfoMatches = await prisma.personalAccessToken.findFirst({
				where: {
					id: values.id,
					userId: existingUser.id,
					email: existingUser.email
				}
			})

			if (!patUserInfoMatches) {
				return c.json({ error: 'Unauthorized pat manipulation' }, 401)
			}

			await prisma.personalAccessToken.delete({
				where: {
					id: values.id
				}
			})

			return c.json({ data: { id: values.id } })
		}
	)

export default app
