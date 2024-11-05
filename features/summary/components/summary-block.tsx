'use client'

import { DataCharts } from '@/components/data-charts'
import { DataChartsFallback } from '@/components/data-charts-fallback'
import { DataGrid } from '@/components/data-grid'
import { DataGridFallback } from '@/components/data-grid-fallback'

import { Suspense } from 'react'

export const SummaryBlock = () => {
	return (
		<>
			<Suspense fallback={<DataGridFallback />}>
				<DataGrid />
			</Suspense>
			<Suspense fallback={<DataChartsFallback />}>
				<DataCharts />
			</Suspense>
		</>
	)
}
