import { Hono } from 'hono'
import prisma from '@/lib/prisma'
import { currentUser, clerkClient } from '@clerk/nextjs/server'

const app = new Hono().get('/', async c => {
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
		console.log(`------ Syncing new user to our database clerkId: ${auth.id} ------`)
		const newUserPayload = {
			clerkId: auth.id,
			email: auth.emailAddresses[0].emailAddress,
			username: auth.username,
			firstName: auth.firstName || '',
			lastName: auth.lastName || '',
			photo: auth.imageUrl,
		}

		const newUser = await prisma.user.create({
			data: newUserPayload,
		})
		console.log(
			`------ Synced new user info -- dbUserId: ${newUser.id}  clerkId: ${auth.id} ------`
		)
		const client = await clerkClient()
		client.users.updateUserMetadata(auth.id, {
			publicMetadata: {
				userId: newUser.id,
			},
		})
		console.log(
			`------ Updated clerk user metadata -- dbUserId: ${newUser.id}  clerkId: ${auth.id} ------`
		)
	}

	return c.json({ data: { isSynced: true } })
})

export default app
