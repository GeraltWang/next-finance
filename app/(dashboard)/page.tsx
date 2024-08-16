import { DataCharts } from '@/components/DataCharts'
import { DataGrid } from '@/components/DataGrid'

export default function OverviewPage() {
	return (
		<div className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
			<DataGrid />
			<DataCharts />
		</div>
	)
}
