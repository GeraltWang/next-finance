import prisma from '@/lib/prisma'
import type { Bindings, Variables } from '@/server/env'
import { myValidator } from '@/server/middleware/validator'

import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { HTTPException } from 'hono/http-exception'
import { Webhook } from 'svix'
import { z } from 'zod'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().post(
	'/clerk',
	myValidator(
		'header',
		z.object({
			'svix-id': z.string(),
			'svix-timestamp': z.string(),
			'svix-signature': z.string(),
		})
	),
	async c => {
		// You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
		// const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
		const { WEBHOOK_SECRET } = env(c)

		const header = c.req.valid('header')

		const body = await c.req.json()

		// Create a new Svix instance with your secret.
		const wh = new Webhook(WEBHOOK_SECRET)

		let evt: WebhookEvent

		// Verify the payload with the headers
		try {
			evt = wh.verify(JSON.stringify(body), header) as WebhookEvent
		} catch (err) {
			console.log('Error verifying webhook:', err)
			throw new HTTPException(400, { message: 'Error occured' })
		}

		const eventType = evt.type

		if (eventType === 'user.created') {
			const { id, email_addresses, image_url, first_name, last_name, username } = evt.data

			const user = {
				clerkId: id,
				email: email_addresses[0].email_address,
				username: username!,
				firstName: first_name || '',
				lastName: last_name || '',
				photo: image_url,
			}

			const newUser = await prisma.user.create({
				data: user,
			})

			if (newUser) {
				const client = await clerkClient()
				client.users.updateUserMetadata(id, {
					publicMetadata: {
						userId: newUser.id,
					},
				})
			}

			return c.json({ data: { user: newUser, eventType } })
		}

		if (eventType === 'user.updated') {
			const { id, image_url, first_name, last_name, username } = evt.data

			const user = {
				firstName: first_name || '',
				lastName: last_name || '',
				username: username!,
				photo: image_url,
			}

			const existingUser = await prisma.user.findUnique({
				where: {
					clerkId: id,
				},
			})

			if (!existingUser) {
				throw new HTTPException(404, { message: 'User not found' })
			}

			const updatedUser = await prisma.user.update({
				where: {
					clerkId: id,
				},
				data: user,
			})

			return c.json({ data: { user: updatedUser, eventType } })
		}

		if (eventType === 'user.deleted') {
			const { id } = evt.data

			const existingUser = await prisma.user.findUnique({
				where: {
					clerkId: id,
				},
			})

			if (!existingUser) {
				throw new HTTPException(404, { message: 'User not found' })
			}

			const deletedUser = await prisma.user.delete({
				where: {
					clerkId: id,
				},
			})

			return c.json({ data: { user: deletedUser, eventType } })
		}

		return c.json({ data: { eventType } })
	}
)

export default app
