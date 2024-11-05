'use client'

import { useGetSummary } from '@/features/summary/api/use-get-summary'
import { CommonChart } from '@/components/common-chart'
import { SpendingPie } from '@/components/spending-pie'
import { DataChartsFallback } from '@/components/data-charts-fallback'

export const DataCharts = () => {
	const { data, isLoading } = useGetSummary()

	if (isLoading) {
		return <DataChartsFallback />
	}

	return (
		<div className='grid grid-cols-1 gap-8 lg:grid-cols-6'>
			<div className='col-span-1 lg:col-span-3 xl:col-span-4'>
				<CommonChart data={data?.days} />
			</div>
			<div className='col-span-1 lg:col-span-3 xl:col-span-2'>
				<SpendingPie data={data?.categories} />
			</div>
		</div>
	)
}
