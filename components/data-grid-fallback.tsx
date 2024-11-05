import { DataCardLoading } from '@/components/data-card'

export const DataGridFallback = () => {
	return (
		<div className='mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3'>
			<DataCardLoading />
			<DataCardLoading />
			<DataCardLoading />
		</div>
	)
}
