import { DataCharts } from '@/components/DataCharts'
import { DataGrid } from '@/components/DataGrid'

export default function OverviewPage() {
	return (
		<div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
			<DataGrid />
			<DataCharts />
		</div>
	)
}
