import { CategorySchema } from '@/features/categories/schemas/index'
import prisma from '@/lib/prisma'
import type { Bindings, Variables } from '@/server/env'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
	.get('/', async c => {
		const user = c.get('USER')

		const data = await prisma.category.findMany({
			select: {
				id: true,
				name: true,
			},
			where: {
				userId: user.id,
			},
			orderBy: {
				name: 'asc',
			},
		})
		return c.json({ data })
	})
	.get('/:id', zValidator('param', z.object({ id: z.string().optional() })), async c => {
		const user = c.get('USER')

		const values = c.req.valid('param')

		if (!values.id) {
			throw new HTTPException(400, { message: 'Missing Category ID' })
		}

		const data = await prisma.category.findUnique({
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
			throw new HTTPException(404, { message: 'Category not found' })
		}

		return c.json({ data })
	})
	.post('/', zValidator('json', CategorySchema), async c => {
		const user = c.get('USER')

		const values = c.req.valid('json')

		const trimName = values.name.trim()

		const existingCategory = await prisma.category.findFirst({
			where: {
				name: trimName,
				userId: user.id,
			},
		})

		if (existingCategory) {
			throw new HTTPException(400, {
				message: `Category with name '${existingCategory.name}' already exists`,
			})
		}

		const data = await prisma.category.create({
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

		await prisma.category.deleteMany({
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
		zValidator('json', CategorySchema),
		async c => {
			const user = c.get('USER')

			const values = c.req.valid('param')

			if (!values.id) {
				throw new HTTPException(400, { message: 'Missing Category ID' })
			}

			const body = c.req.valid('json')

			const existingCategory = await prisma.category.findUnique({
				where: {
					id: values.id,
					userId: user.id,
				},
			})

			if (!existingCategory) {
				throw new HTTPException(404, { message: 'Category not found' })
			}

			const data = await prisma.category.update({
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
			throw new HTTPException(400, { message: 'Missing Category ID' })
		}

		const existingCategory = await prisma.category.findUnique({
			where: {
				id: values.id,
				userId: user.id,
			},
		})

		if (!existingCategory) {
			throw new HTTPException(404, { message: 'Category not found' })
		}

		const data = await prisma.category.delete({
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
