import { calculatePercentageChange, fillMissingDays } from '@/lib/utils'
import prisma from '@/prisma/client'
import { UserMeta } from '@/types'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import dayjs from '@/lib/dayjs'
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
		const userMeta = auth?.sessionClaims?.userMeta as UserMeta
		if (!userMeta?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const { from, to, accountId } = c.req.valid('query')

		const defaultTo = dayjs().utc().endOf('day').toDate()
		const defaultFrom = dayjs(defaultTo).utc().subtract(30, 'day').startOf('day').toDate()

		const startDate = from ? dayjs(from).utc(true).startOf('day').toDate() : defaultFrom
		const endDate = to ? dayjs(to).utc(true).endOf('day').toDate() : defaultTo

		const periodLength = dayjs(endDate).diff(startDate, 'day') + 1
		const lastPeriodStart = dayjs(startDate).subtract(periodLength, 'day').startOf('day').toDate()
		const lastPeriodEnd = dayjs(endDate).subtract(periodLength, 'day').endOf('day').toDate()

		async function fetchFinancialData(
			userId: string,
			startDate: Date,
			endDate: Date,
			accountId?: string
		) {
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
					category: {
						select: {
							name: true,
						},
					},
				},
			})

			const income = transactions
				.filter(transaction => transaction.amount >= 0)
				.reduce((sum, transaction) => sum + Number(transaction.amount), 0)

			const expenses = transactions
				.filter(transaction => transaction.amount < 0)
				.reduce((sum, transaction) => sum + Number(transaction.amount), 0)

			const remaining = transactions.reduce(
				(sum, transaction) => sum + Number(transaction.amount),
				0
			)

			const categoryMap: { [key: string]: number } = {}
			transactions.forEach(transaction => {
				const categoryName = transaction.category?.name || 'Uncategorized'
				if (!categoryMap[categoryName]) {
					categoryMap[categoryName] = 0
				}
				categoryMap[categoryName] += Math.abs(Number(transaction.amount))
			})

			const categories = Object.entries(categoryMap)
				.map(([name, amount]) => ({ name, amount }))
				.sort((a, b) => b.amount - a.amount)

			return {
				income,
				expenses,
				remaining,
				categories,
			}
		}

		const current = await fetchFinancialData(userMeta.userId, startDate, endDate, accountId)
		const last = await fetchFinancialData(
			userMeta.userId,
			lastPeriodStart,
			lastPeriodEnd,
			accountId
		)

		const incomeChange = calculatePercentageChange(current.income, last.income)
		const expensesChange = calculatePercentageChange(current.expenses, last.expenses)
		const remainingChange = calculatePercentageChange(current.remaining, last.remaining)

		const topCategories = current.categories.slice(0, 3)
		const otherCategories = current.categories.slice(3)
		const otherSum = otherCategories.reduce((acc, category) => acc + Number(category.amount), 0)
		const finalCategories = topCategories.map(category => ({
			...category,
			amount: Number(category.amount),
		}))

		if (otherCategories.length > 0) {
			finalCategories.push({ name: 'Other', amount: otherSum })
		}

		// const activeDays = await prisma.transaction.groupBy({
		// 	by: ['date'],
		// 	where: {
		// 		account: {
		// 			userId: userMeta.userId,
		// 			...(accountId && { id: accountId }), // 如果 accountId 存在，则添加到查询条件中
		// 		},
		// 		date: {
		// 			gte: startDate,
		// 			lte: endDate,
		// 		},
		// 	},
		// 	_sum: {
		// 		amount: true,
		// 	},
		// 	orderBy: {
		// 		date: 'asc',
		// 	},
		// })
		const activeDays = await prisma.transaction.findMany({
			where: {
				account: {
					userId: userMeta.userId,
					...(accountId && { id: accountId }), // 如果 accountId 存在，则添加到查询条件中
				},
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			select: {
				date: true,
				amount: true,
			},
			orderBy: {
				date: 'asc',
			},
		})
		console.log('🚀 ~ activeDays:', activeDays)

		function groupAndSumByDate(data: { amount: number; date: Date }[]) {
			const groupedData: { [key: string]: number } = {}

			data.forEach(item => {
				const date = item.date.toISOString().split('T')[0] // 只保留日期部分
				if (!groupedData[date]) {
					groupedData[date] = 0
				}
				groupedData[date] += item.amount
			})

			return Object.entries(groupedData).map(([date, amount]) => ({
				date,
				income: amount >= 0 ? amount : 0,
				expenses: amount < 0 ? amount : 0,
			}))
		}

		// const formatActiveDays = activeDays.map(day => ({
		// 	...day,
		// 	date: day.date.toISOString().split('T')[0],
		// }))

		const activeDaysData = groupAndSumByDate(activeDays)

		// const activeDays = (await prisma.$queryRaw`
		//         SELECT
		//             "Transaction".date AS date,
		//             SUM(CASE WHEN "Transaction".amount >= 0 THEN "Transaction".amount ELSE 0 END) AS income,
		//             SUM(CASE WHEN "Transaction".amount < 0 THEN "Transaction".amount ELSE 0 END) AS expenses
		//         FROM "Transaction"
		//         INNER JOIN "Account" ON "Transaction".account_id = "Account".id
		//         WHERE
		//             "Account".user_id = ${userMeta.userId}
		//             AND "Transaction".date BETWEEN ${startDate} AND ${endDate}
		//             ${accountId ? Prisma.sql`AND "Transaction".account_id = ${accountId}` : Prisma.empty}
		//         GROUP BY "Transaction".date
		//         ORDER BY "Transaction".date ASC
		//     `) as { date: Date; income: number; expenses: number }[]

		// // BigInt to Number
		// const activeDaysData = activeDays.map(day => ({
		// 	...day,
		// 	income: Number(day.income),
		// 	expenses: Number(day.expenses),
		// }))

		// const activeDaysData = activeDays.map(day => ({
		// 	date: day.date,
		// 	income: Number(day._sum.amount) >= 0 ? Number(day._sum.amount) : 0,
		// 	expenses: Number(day._sum.amount) < 0 ? Number(day._sum.amount) : 0,
		// }))

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
