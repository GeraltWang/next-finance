import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '@/prisma/client'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

const app = new Hono().get('/', clerkMiddleware(), async c => {
	const auth = getAuth(c)

	if (!auth?.userId) {
		throw new HTTPException(401, {
			res: c.json({ error: 'Unauthorized' }, 401),
		})
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
