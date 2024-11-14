import dayjs from '@/lib/dayjs'
import prisma from '@/lib/prisma'
import { calculatePercentageChange } from '@/lib/utils'
import type { Bindings, Variables } from '@/server/env'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().get(
	'/',
	zValidator(
		'query',
		z.object({
			from: z.string().optional(),
			to: z.string().optional(),
			accountId: z.string().optional(),
		})
	),
	async c => {
		const user = c.get('USER')

		const { from, to, accountId } = c.req.valid('query')

		// 输入参数验证
		if (from && !dayjs(from, 'YYYY-MM-DD', true).isValid()) {
			throw new HTTPException(400, { message: 'Invalid from date format' })
		}
		if (to && !dayjs(to, 'YYYY-MM-DD', true).isValid()) {
			throw new HTTPException(400, { message: 'Invalid to date format' })
		}

		const defaultTo = dayjs().utc().endOf('day')
		const defaultFrom = defaultTo.clone().subtract(30, 'day').startOf('day')

		const startDate = from ? dayjs(from).utc(true).startOf('day') : defaultFrom
		const endDate = to ? dayjs(to).utc(true).endOf('day') : defaultTo

		const periodLength = endDate.diff(startDate, 'day') + 1
		const lastPeriodStart = startDate.clone().subtract(periodLength, 'day').startOf('day')
		const lastPeriodEnd = endDate.clone().subtract(periodLength, 'day').endOf('day')

		async function fetchFinancialData(
			userId: string,
			startDate: dayjs.Dayjs,
			endDate: dayjs.Dayjs,
			accountId?: string
		) {
			try {
				const transactions = await prisma.transaction.findMany({
					where: {
						account: {
							userId: userId,
							...(accountId && { id: accountId }),
						},
						date: {
							gte: startDate.toDate(),
							lte: endDate.toDate(),
						},
					},
					select: {
						amount: true,
						date: true,
						category: {
							select: {
								name: true,
							},
						},
					},
					orderBy: {
						date: 'asc',
					},
				})

				let income = 0
				let expenses = 0
				let remaining = 0
				const categoryMap: Record<string, number> = {}
				const dateMap: Record<string, { income: number; expenses: number }> = {}

				transactions.forEach(transaction => {
					const amount = Number(transaction.amount)
					remaining += amount

					if (amount >= 0) {
						income += amount
					} else {
						expenses += amount
					}

					// 分类汇总
					const categoryName = transaction.category?.name || 'Uncategorized'
					categoryMap[categoryName] = (categoryMap[categoryName] || 0) + Math.abs(amount)

					// 日期汇总
					const dateKey = dayjs(transaction.date).format('YYYY-MM-DD')
					if (!dateMap[dateKey]) {
						dateMap[dateKey] = { income: 0, expenses: 0 }
					}
					if (amount >= 0) {
						dateMap[dateKey].income += amount
					} else {
						dateMap[dateKey].expenses += amount
					}
				})

				const categories = Object.entries(categoryMap)
					.map(([name, amount]) => ({ name, amount }))
					.sort((a, b) => b.amount - a.amount)

				// 填补缺失的日期
				const days: {
					date: string
					income: number
					expenses: number
				}[] = []
				let currentDate = startDate.clone()

				while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
					const dateStr = currentDate.format('YYYY-MM-DD')
					days.push({
						date: dateStr,
						income: dateMap[dateStr]?.income || 0,
						expenses: dateMap[dateStr]?.expenses || 0,
					})
					currentDate = currentDate.add(1, 'day')
				}

				return {
					income,
					expenses,
					remaining,
					categories,
					days,
				}
			} catch (error) {
				console.error('Error fetching financial data:', error)
				throw error
			}
		}

		let data

		try {
			const current = await fetchFinancialData(user.id, startDate, endDate, accountId)
			const last = await fetchFinancialData(user.id, lastPeriodStart, lastPeriodEnd, accountId)

			const incomeChange = calculatePercentageChange(current.income, last.income)
			const expensesChange = calculatePercentageChange(current.expenses, last.expenses)
			const remainingChange = calculatePercentageChange(current.remaining, last.remaining)

			const topCategories = current.categories.slice(0, 3)
			const otherCategories = current.categories.slice(3)
			const otherSum = otherCategories.reduce((acc, category) => acc + category.amount, 0)
			const finalCategories = topCategories.map(category => ({
				name: category.name,
				amount: category.amount,
			}))

			if (otherCategories.length > 0) {
				finalCategories.push({ name: 'Other', amount: otherSum })
			}

			data = {
				remainingAmount: current.remaining,
				remainingChange,
				incomeAmount: current.income,
				incomeChange,
				expensesAmount: current.expenses,
				expensesChange,
				categories: finalCategories,
				days: current.days,
			}
			return c.json({ data })
		} catch (error) {
			throw new HTTPException(500, { message: 'Internal Server Error', cause: error })
		}
	}
)

export default app
