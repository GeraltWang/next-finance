import prisma from '@/prisma/client'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { parse, subDays, differenceInDays } from 'date-fns'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono().get(
	'/',
	clerkMiddleware(),
	zValidator(
		'query',
		z.object({
			from: z.string().optional(),
			to: z.string().optional(),
			accountId: z.string().optional(),
		})
	),
	async c => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const { from, to, accountId } = c.req.valid('query')

		const defaultTo = new Date()
		const defaultFrom = subDays(defaultTo, 30)

		const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom
		const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo

		const periodLength = differenceInDays(endDate, startDate) + 1
		const lastPeriodStart = subDays(startDate, periodLength)
		const lastPeriodEnd = subDays(endDate, periodLength)

		async function fetchFinancialData(userId: string, startDate: Date, endDate: Date) {
			return await prisma.$queryRaw`SELECT 
        CASE 
          WHEN transactions.amount >= 0 THEN transactions.amount 
          ELSE 0 
        END AS income,
        CASE 
          WHEN transactions.amount < 0 THEN transactions.amount 
          ELSE 0 
        END AS expenses
      FROM transactions`
		}
		return c.json({ summary: true })
	}
)

export default app
