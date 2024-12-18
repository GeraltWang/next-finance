import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AreaChart, BarChart3, FileSearch, LineChart } from 'lucide-react'
import { AreaVariant } from '@/components/area-variant'
import { BarVariant } from '@/components/bar-variant'
import { LineVariant } from '@/components/line-variant'
import { LoadingSpinner } from '@/components/loading-spinner'

type Props = {
	data?: { date: string; income: number; expenses: number }[]
}

export const CommonChart = ({ data = [] }: Props) => {
	const [chartType, setChartType] = useState('area')

	const onTypeChange = (type: string) => {
		// TODO: add paywall
		setChartType(type)
	}

	return (
		<Card className='border-none drop-shadow-sm'>
			<CardHeader className='flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0'>
				<CardTitle className='line-clamp-1 text-xl'>Transactions</CardTitle>
				<Select defaultValue={chartType} onValueChange={onTypeChange}>
					<SelectTrigger className='h-9 rounded-md px-3 lg:w-auto'>
						<SelectValue placeholder={'Chart type'} />
						<SelectContent>
							<SelectItem value='area'>
								<div className='flex items-center'>
									<AreaChart className='mr-2 size-4 shrink-0' />
									<p className='line-clamp-1'>Area chart</p>
								</div>
							</SelectItem>
							<SelectItem value='bar'>
								<div className='flex items-center'>
									<BarChart3 className='mr-2 size-4 shrink-0' />
									<p className='line-clamp-1'>Bar chart</p>
								</div>
							</SelectItem>
							<SelectItem value='line'>
								<div className='flex items-center'>
									<LineChart className='mr-2 size-4 shrink-0' />
									<p className='line-clamp-1'>Line chart</p>
								</div>
							</SelectItem>
						</SelectContent>
					</SelectTrigger>
				</Select>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<div className='flex h-[350px] w-full flex-col items-center justify-center gap-y-4'>
						<FileSearch className='size-6 text-muted-foreground' />
						<p className='text-sm text-muted-foreground'>No data durning this period</p>
					</div>
				) : (
					<>
						{chartType === 'area' && <AreaVariant data={data} />}
						{chartType === 'bar' && <BarVariant data={data} />}
						{chartType === 'line' && <LineVariant data={data} />}
					</>
				)}
			</CardContent>
		</Card>
	)
}

export const ChartLoading = () => {
	return (
		<Card className='border-none drop-shadow-sm'>
			<CardHeader className='flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-9 w-full lg:w-[120px]' />
			</CardHeader>
			<CardContent>
				<div className='flex h-[350px] w-full items-center justify-center'>
					<LoadingSpinner />
				</div>
			</CardContent>
		</Card>
	)
}
