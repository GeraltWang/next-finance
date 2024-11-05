'use client'

import { useGetSummary } from '@/features/summary/api/use-get-summary'
import { formatDateRange } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { DataCard } from '@/components/data-card'
import { DataGridFallback } from '@/components/data-grid-fallback'
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
		return <DataGridFallback />
	}

	return (
		<div className='mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3'>
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
