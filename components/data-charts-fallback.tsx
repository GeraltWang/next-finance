import { ChartLoading } from '@/components/common-chart'
import { SpendingPieLoading } from '@/components/spending-pie'

export const DataChartsFallback = () => {
	return (
		<div className='grid grid-cols-1 gap-8 lg:grid-cols-6'>
			<div className='col-span-1 lg:col-span-3 xl:col-span-4'>
				<ChartLoading />
			</div>
			<div className='col-span-1 lg:col-span-3 xl:col-span-2'>
				<SpendingPieLoading />
			</div>
		</div>
	)
}
