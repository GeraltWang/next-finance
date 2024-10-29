import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * 将金额转换为千分之一单位
 * @param amount
 * @returns
 */
export function convertAmountToMiliunits(amount: number) {
	return Math.round(amount * 1000)
}

/**
 * 将金额从千分之一单位转换为常规单位
 * @param amount
 * @returns
 */
export function convertAmountFromMiliunits(amount: number) {
	return amount / 1000
}

export function formatCurrency(value: number, lang: string = 'zh-CN') {
	return new Intl.NumberFormat(lang, {
		style: 'currency',
		currency: 'CNY',
		maximumFractionDigits: 2,
	}).format(value)
}

/**
 * 对比两个数值的百分比变化
 * @param current
 * @param previous
 * @returns
 */
export function calculatePercentageChange(current: number, previous: number) {
	if (previous === 0) {
		return previous === current ? 0 : 100
	}

	return ((current - previous) / previous) * 100
}

export function formatPercentage(
	value: number,
	options: {
		lang?: string
		addPrefix?: boolean
	} = {
		lang: 'zh-CN',
		addPrefix: false,
	}
) {
	const formatted = new Intl.NumberFormat(options.lang, {
		style: 'percent',
	}).format(value / 100)

	if (options.addPrefix && value > 0) {
		return `+${formatted}`
	}

	return formatted
}

/**
 * 填充缺失的日期
 * @param activeDays
 * @param startDate
 * @param endDate
 * @returns
 */
export function fillMissingDays(
	activeDays: { date: string | Date; income: number; expenses: number }[],
	startDate: Date,
	endDate: Date
) {
	if (activeDays.length === 0) {
		return []
	}

	const allDays = []
	let currentDay = dayjs(startDate)

	while (currentDay.isBefore(dayjs(endDate)) || currentDay.isSame(dayjs(endDate))) {
		allDays.push(currentDay.toDate())
		currentDay = currentDay.add(1, 'day')
	}

	const transactionsByDay = allDays.map(day => {
		const found = activeDays.find(activeDay => dayjs(activeDay.date).isSame(day, 'day'))

		if (found) {
			return found
		} else {
			return {
				date: day,
				income: 0,
				expenses: 0,
			}
		}
	})

	return transactionsByDay
}

type Period = {
	from?: Date | string
	to?: Date | string
}

// export function formatDateRange(period: Period) {
// 	const defaultTo = new Date()
// 	const defaultFrom = subDays(defaultTo, 30)

// 	if (!period?.from) {
// 		return `${format(defaultFrom, 'LLL dd')} - ${format(defaultTo, 'LLL dd, y')}`
// 	}

// 	if (period.to) {
// 		return `${format(period.from, 'LLL dd')} - ${format(period.to, 'LLL dd, y')}`
// 	}

// 	return `${format(period.from, 'LLL dd, y')}`
// }

export function formatDateRange(period: Period) {
	const defaultTo = dayjs().utc(true)
	const defaultFrom = defaultTo.subtract(30, 'day')

	if (!period?.from) {
		return `${defaultFrom.format('MMM DD')} - ${defaultTo.format('MMM DD, YYYY')}`
	}

	const from = dayjs(period.from)
	if (period.to) {
		const to = dayjs(period.to)
		return `${from.format('MMM DD')} - ${to.format('MMM DD, YYYY')}`
	}

	return `${from.format('MMM DD, YYYY')}`
}
