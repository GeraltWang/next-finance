import { PatSchema } from '@/features/pat/schemas/index'
import prisma from '@/lib/prisma'
import type { Bindings, Variables } from '@/server/env'
import { myValidator } from '@/server/middleware/validator'

import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { HTTPException } from 'hono/http-exception'
import { sign as signJwt } from 'hono/jwt'
import { z } from 'zod'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
	.get('/', async c => {
		const user = c.get('USER')

		const pats = await prisma.personalAccessToken.findMany({
			where: {
				userId: user.id,
			},
		})

		return c.json({ data: pats })
	})
	.post('/generate-pat', myValidator('json', PatSchema), async c => {
		const user = c.get('USER')

		const values = c.req.valid('json')

		const existingUser = await prisma.user.findUnique({
			where: {
				id: user.id,
			},
			select: {
				id: true,
				email: true,
			},
		})

		if (!existingUser) {
			throw new HTTPException(401, { message: 'User does not exist' })
		}

		const payload = existingUser

		const { JWT_SECRET } = env(c)

		const token = await signJwt(payload, JWT_SECRET)

		const duplicateName = await prisma.personalAccessToken.findFirst({
			where: {
				userId: existingUser.id,
				name: values.name.toLowerCase(),
			},
		})

		if (duplicateName) {
			throw new HTTPException(400, { message: 'PAT with this name already exists' })
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
	.delete('/:id', myValidator('param', z.object({ id: z.string().optional() })), async c => {
		const user = c.get('USER')

		const values = c.req.valid('param')

		if (!values.id) {
			throw new HTTPException(400, { message: 'Missing ID' })
		}

		const existingUser = await prisma.user.findUnique({
			where: {
				id: user.id,
			},
		})

		if (!existingUser) {
			throw new HTTPException(401, { message: 'User does not exist' })
		}

		const patUserInfoMatches = await prisma.personalAccessToken.findFirst({
			where: {
				id: values.id,
				userId: existingUser.id,
				email: existingUser.email,
			},
		})

		if (!patUserInfoMatches) {
			throw new HTTPException(401, { message: 'Unauthorized PAT manipulation' })
		}

		await prisma.personalAccessToken.delete({
			where: {
				id: values.id,
			},
		})

		return c.json({ data: { id: values.id } })
	})

export default app
