import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { WebhookEvent } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import prisma from '@/prisma/client'

const app = new Hono().post(
	'/clerk',
	zValidator(
		'header',
		z.object({
			'svix-id': z.string(),
			'svix-timestamp': z.string(),
			'svix-signature': z.string(),
		})
	),
	async c => {
		// You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
		const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

		if (!WEBHOOK_SECRET) {
			throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
		}

		const header = c.req.valid('header')

		const body = c.req.json()

		// Create a new Svix instance with your secret.
		const wh = new Webhook(WEBHOOK_SECRET)

		let evt: WebhookEvent

		// Verify the payload with the headers
		try {
			evt = wh.verify(JSON.stringify(body), {
				'svix-id': header['svix-id'],
				'svix-timestamp': header['svix-timestamp'],
				'svix-signature': header['svix-signature'],
			}) as WebhookEvent
		} catch (err) {
			console.error('Error verifying webhook:', err)
			return c.json({ error: 'Error verifying webhook' }, 400)
		}

		// Get the ID and type
		const { id } = evt.data
		const eventType = evt.type

		console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
		console.log('Webhook body:', JSON.stringify(body))

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
				await clerkClient.users.updateUserMetadata(id, {
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
				return c.json({ error: 'User not found' }, 404)
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
				return c.json({ error: 'User not found' }, 404)
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
