'use client'

import { DataCharts } from '@/components/data-charts'
import { DataGrid } from '@/components/data-grid'

import { Suspense } from 'react'

export const SummaryBlock = () => {
	return (
		<>
			<Suspense>
				<DataGrid />
			</Suspense>
			<Suspense>
				<DataCharts />
			</Suspense>
		</>
	)
}
