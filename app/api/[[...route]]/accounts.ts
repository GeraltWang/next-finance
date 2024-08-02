import { Hono } from 'hono'
import prisma from '@/prisma/client'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

const app = new Hono().get('/', clerkMiddleware(), async c => {
	const auth = getAuth(c)

	if (!auth?.userId) {
		return c.json({ error: 'Unauthorized' }, 401)
	}

	const data = await prisma.account.findMany({
		select: {
			id: true,
			name: true,
		},
		where: {
			userId: auth.userId,
		},
	})
	return c.json({ data })
})

export default app
