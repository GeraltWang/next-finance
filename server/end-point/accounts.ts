import { AccountSchema } from '@/features/accounts/schemas/index'
import prisma from '@/lib/prisma'
import type { Bindings, Variables } from '@/server/env'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
	.get('/', async c => {
		const user = c.get('USER')

		const data = await prisma.account.findMany({
			select: {
				id: true,
				name: true,
			},
			where: {
				userId: user.id,
			},
		})

		return c.json({ data })
	})
	.get('/:id', zValidator('param', z.object({ id: z.string().optional() })), async c => {
		const user = c.get('USER')

		const values = c.req.valid('param')

		if (!values.id) {
			throw new HTTPException(400, { message: 'Missing Account ID' })
		}

		const data = await prisma.account.findUnique({
			where: {
				id: values.id,
				userId: user.id,
			},
			select: {
				id: true,
				name: true,
			},
		})

		if (!data) {
			throw new HTTPException(404, { message: 'Account not found' })
		}

		return c.json({ data })
	})
	.post('/', zValidator('json', AccountSchema), async c => {
		const user = c.get('USER')

		const values = c.req.valid('json')

		const trimName = values.name.trim()

		const existingAccount = await prisma.account.findFirst({
			where: {
				name: trimName,
				userId: user.id,
			},
		})

		if (existingAccount) {
			throw new HTTPException(400, {
				message: `Account with name '${existingAccount.name}' already exists`,
			})
		}

		const data = await prisma.account.create({
			data: {
				name: trimName,
				userId: user.id,
			},
			select: {
				id: true,
				name: true,
			},
		})

		return c.json({ data })
	})
	.post('/bulk-delete', zValidator('json', z.object({ ids: z.array(z.string()) })), async c => {
		const user = c.get('USER')

		const values = c.req.valid('json')

		await prisma.account.deleteMany({
			where: {
				id: {
					in: values.ids,
				},
				userId: user.id,
			},
		})

		return c.json({ data: values.ids })
	})
	.patch(
		'/:id',
		zValidator('param', z.object({ id: z.string().optional() })),
		zValidator('json', AccountSchema),
		async c => {
			const user = c.get('USER')

			const values = c.req.valid('param')

			if (!values.id) {
				throw new HTTPException(400, { message: 'Missing Account ID' })
			}

			const body = c.req.valid('json')

			const existingAccount = await prisma.account.findUnique({
				where: {
					id: values.id,
					userId: user.id,
				},
			})

			if (!existingAccount) {
				throw new HTTPException(404, { message: 'Account not found' })
			}

			const data = await prisma.account.update({
				where: {
					id: values.id,
					userId: user.id,
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
	.delete('/:id', zValidator('param', z.object({ id: z.string().optional() })), async c => {
		const user = c.get('USER')

		const values = c.req.valid('param')

		if (!values.id) {
			throw new HTTPException(400, { message: 'Missing Account ID' })
		}

		const existingAccount = await prisma.account.findUnique({
			where: {
				id: values.id,
				userId: user.id,
			},
		})

		if (!existingAccount) {
			throw new HTTPException(404, { message: 'Account not found' })
		}

		const data = await prisma.account.delete({
			where: {
				id: values.id,
				userId: user.id,
			},
			select: {
				id: true,
			},
		})

		return c.json({ data })
	})

export default app
