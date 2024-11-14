import { AccountSchema } from '@/features/accounts/schemas/index'
import prisma from '@/lib/prisma'
import type { Bindings, Variables } from '@/server/env'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
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
			return c.json({ error: 'Missing Account ID' }, 400)
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
			return c.json({ error: 'Account not found' }, 404)
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
			return c.json({ error: `Account with name '${existingAccount.name}' already exists` }, 400)
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
				return c.json({ error: 'Missing Account ID' }, 400)
			}

			const body = c.req.valid('json')

			const existingAccount = await prisma.account.findUnique({
				where: {
					id: values.id,
					userId: user.id,
				},
			})

			if (!existingAccount) {
				return c.json({ error: 'Account not found' }, 404)
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
			return c.json({ error: 'Missing Account ID' }, 400)
		}

		const existingAccount = await prisma.account.findUnique({
			where: {
				id: values.id,
				userId: user.id,
			},
		})

		if (!existingAccount) {
			return c.json({ error: 'Account not found' }, 404)
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
