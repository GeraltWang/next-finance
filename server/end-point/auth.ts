import { Hono } from 'hono'
import prisma from '@/lib/prisma'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { currentUser } from '@clerk/nextjs/server'

const app = new Hono().get('/', clerkMiddleware(), async c => {
	const auth = await currentUser()

	if (!auth) {
		return c.json({ data: { isSynced: false } })
	}

	const existingUser = await prisma.user.findUnique({
		where: {
			clerkId: auth.id,
		},
	})

	if (!existingUser) {
		console.log('------ Syncing new user to our database ------')
		const newUserPayload = {
			clerkId: auth.id,
			email: auth.emailAddresses[0].emailAddress,
			username: auth.username,
			firstName: auth.firstName || '',
			lastName: auth.lastName || '',
			photo: auth.imageUrl,
		}

		await prisma.user.create({
			data: newUserPayload,
		})
	}

	return c.json({ data: { isSynced: true } })
})

export default app
