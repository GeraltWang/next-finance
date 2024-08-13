import { type ClassValue, clsx } from 'clsx'
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns'
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

export function formatCurrency(value: number) {
	return Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
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
		addPrefix?: boolean
	} = {
		addPrefix: false,
	}
) {
	const formatted = new Intl.NumberFormat('en-US', {
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
	activeDays: { date: Date; income: number; expenses: number }[],
	startDate: Date,
	endDate: Date
) {
	if (activeDays.length === 0) {
		return []
	}

	const allDays = eachDayOfInterval({
		start: startDate,
		end: endDate,
	})

	const transactionsByDay = allDays.map(day => {
		const found = activeDays.find(activeDay => isSameDay(activeDay.date, day))

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

export function formatDateRange(period: Period) {
	const defaultTo = new Date()
	const defaultFrom = subDays(defaultTo, 30)

	if (!period?.from) {
		return `${format(defaultFrom, 'LLL dd')} - ${format(defaultTo, 'LLL dd, y')}`
	}

	if (period.to) {
		return `${format(period.from, 'LLL dd')} - ${format(period.to, 'LLL dd, y')}`
	}

	return `${format(period.from, 'LLL dd, y')}`
}
