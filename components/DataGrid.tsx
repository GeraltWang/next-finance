'use client'
import { useGetSummary } from '@/features/summary/api/use-get-summary'
import { formatDateRange } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { DataCard, DataCardLoading } from './DataCard'
import { FaPiggyBank } from 'react-icons/fa'
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'

export const DataGrid = () => {
	const param = useSearchParams()
	const from = param.get('from') || undefined
	const to = param.get('to') || undefined

	const { data, isLoading } = useGetSummary()

	const dateRangeLabel = formatDateRange({
		from,
		to,
	})

	if (isLoading) {
		return (
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
				<DataCardLoading />
				<DataCardLoading />
				<DataCardLoading />
			</div>
		)
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
			<DataCard
				header='Remaining'
				value={data?.remainingAmount}
				percentageChange={data?.remainingChange}
				dateRange={dateRangeLabel}
				variant={'default'}
				icon={FaPiggyBank}
			/>
			<DataCard
				header='Income'
				value={data?.incomeAmount}
				percentageChange={data?.incomeChange}
				dateRange={dateRangeLabel}
				variant={'success'}
				icon={FaArrowTrendUp}
			/>
			<DataCard
				header='Expenses'
				value={data?.expensesAmount}
				percentageChange={data?.expensesChange}
				dateRange={dateRangeLabel}
				variant={'danger'}
				icon={FaArrowTrendDown}
			/>
		</div>
	)
}
