import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { FileSearch, Loader2, PieChart, Radar, Target } from 'lucide-react'
import { useState } from 'react'
import { PieVariant } from '@/components/pie-variant'
import { RadarVariant } from '@/components/radar-variant'
import { RadialVariant } from '@/components/radial-variant'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
	data?: { name: string; amount: number }[]
}

export const SpendingPie = ({ data = [] }: Props) => {
	const [chartType, setChartType] = useState('pie')

	const onTypeChange = (type: string) => {
		// TODO: add paywall
		setChartType(type)
	}

	return (
		<Card className='border-none drop-shadow-sm'>
			<CardHeader className='flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0'>
				<CardTitle className='line-clamp-1 text-xl'>Categories</CardTitle>
				<Select defaultValue={chartType} onValueChange={onTypeChange}>
					<SelectTrigger className='h-9 rounded-md px-3 lg:w-auto'>
						<SelectValue placeholder={'Chart type'} />
						<SelectContent>
							<SelectItem value='pie'>
								<div className='flex items-center'>
									<PieChart className='mr-2 size-4 shrink-0' />
									<p className='line-clamp-1'>Pie chart</p>
								</div>
							</SelectItem>
							<SelectItem value='radar'>
								<div className='flex items-center'>
									<Radar className='mr-2 size-4 shrink-0' />
									<p className='line-clamp-1'>Radar chart</p>
								</div>
							</SelectItem>
							<SelectItem value='radial'>
								<div className='flex items-center'>
									<Target className='mr-2 size-4 shrink-0' />
									<p className='line-clamp-1'>Radial chart</p>
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
						{chartType === 'pie' && <PieVariant data={data} />}
						{chartType === 'radar' && <RadarVariant data={data} />}
						{chartType === 'radial' && <RadialVariant data={data} />}
					</>
				)}
			</CardContent>
		</Card>
	)
}

export const SpendingPieLoading = () => {
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
