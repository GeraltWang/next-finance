import { calculatePercentageChange, fillMissingDays } from '@/lib/utils'
import prisma from '@/prisma/client'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { Prisma } from '@prisma/client'
import { differenceInDays, parse, subDays } from 'date-fns'
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
			const transactions = await prisma.transaction.findMany({
				where: {
					account: {
						userId: userId,
						...(accountId && { id: accountId }), // 如果 accountId 存在，则添加到查询条件中
					},
					date: {
						gte: startDate,
						lte: endDate,
					},
				},
				select: {
					amount: true,
				},
			})

			const income = transactions
				.filter(transaction => transaction.amount >= 0)
				.reduce((sum, transaction) => sum + Number(transaction.amount), 0)

			const expenses = transactions
				.filter(transaction => transaction.amount < 0)
				.reduce((sum, transaction) => sum + Number(transaction.amount), 0)

			const remaining = transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0)

			return {
				income,
				expenses,
				remaining,
			}
		}

		const current = await fetchFinancialData(auth.userId, startDate, endDate)
		const last = await fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd)

		const incomeChange = calculatePercentageChange(current.income, last.income)
		const expensesChange = calculatePercentageChange(current.expenses, last.expenses)
		const remainingChange = calculatePercentageChange(current.remaining, last.remaining)

		const category = (await prisma.$queryRaw`
				SELECT 
					"Category".name AS name, 
					SUM(ABS("Transaction".amount)) AS amount
				FROM "Transaction"
				INNER JOIN "Category" ON "Transaction".category_id = "Category".id
				INNER JOIN "Account" ON "Transaction".account_id = "Account".id
				WHERE
					"Account".user_id = ${auth.userId}
					AND "Transaction".date BETWEEN ${startDate}::timestamp AND ${endDate}::timestamp
					${accountId ? Prisma.sql`AND "Transaction".account_id = ${accountId}` : Prisma.sql``}
				GROUP BY "Category".name
				HAVING SUM(ABS("Transaction".amount)) > 0
				ORDER BY SUM(ABS("Transaction".amount)) DESC
			`) as { name: string; amount: number }[]

		const topCategories = category.slice(0, 3)
		const otherCategories = category.slice(3)
		const otherSum = otherCategories.reduce((acc, category) => acc + Number(category.amount), 0)
		const finalCategories = topCategories.map(category => ({
			...category,
			amount: Number(category.amount),
		}))

		if (otherCategories.length > 0) {
			finalCategories.push({ name: 'Other', amount: otherSum })
		}

		const activeDays = (await prisma.$queryRaw`
			SELECT 
				"Transaction".date AS date, 
				SUM(CASE WHEN "Transaction".amount >= 0 THEN "Transaction".amount ELSE 0 END) AS income, 
      	SUM(CASE WHEN "Transaction".amount < 0 THEN "Transaction".amount ELSE 0 END) AS expenses
			FROM "Transaction"
			-- INNER JOIN "Category" ON "Transaction".category_id = "Category".id
			INNER JOIN "Account" ON "Transaction".account_id = "Account".id
			WHERE
				"Account".user_id = ${auth.userId}
				AND "Transaction".date BETWEEN ${startDate}::timestamp AND ${endDate}::timestamp
				${accountId ? Prisma.sql`AND "Transaction".account_id = ${accountId}` : Prisma.sql``}
			GROUP BY "Transaction".date
			ORDER BY "Transaction".date ASC
		`) as { date: Date; income: number; expenses: number }[]

		// BigInt to Number
		const activeDaysData = activeDays.map(day => ({
			...day,
			income: Number(day.income),
			expenses: Number(day.expenses),
		}))

		// 填补缺失的日期，因为并不是每天都有记录
		const days = fillMissingDays(activeDaysData, startDate, endDate)

		return c.json({
			data: {
				remainingAmount: current.remaining,
				remainingChange,
				incomeAmount: current.income,
				incomeChange,
				expensesAmount: current.expenses,
				expensesChange,
				categories: finalCategories,
				days,
			},
		})
	}
)

export default app
