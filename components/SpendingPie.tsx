import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileSearch, PieChart, Radar, Target } from 'lucide-react'
import { useState } from 'react'
import { PieVariant } from './PieVariant'
import { RadarVariant } from './RadarVariant'

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
			<CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
				<CardTitle className='text-xl line-clamp-1'>Categories</CardTitle>
				<Select defaultValue={chartType} onValueChange={onTypeChange}>
					<SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
						<SelectValue placeholder={'Chart type'} />
						<SelectContent>
							<SelectItem value='pie'>
								<div className='flex items-center'>
									<PieChart className='size-4 mr-2 shrink-0' />
									<p className='line-clamp-1'>Pie chart</p>
								</div>
							</SelectItem>
							<SelectItem value='radar'>
								<div className='flex items-center'>
									<Radar className='size-4 mr-2 shrink-0' />
									<p className='line-clamp-1'>Radar chart</p>
								</div>
							</SelectItem>
							<SelectItem value='radial'>
								<div className='flex items-center'>
									<Target className='size-4 mr-2 shrink-0' />
									<p className='line-clamp-1'>Radial chart</p>
								</div>
							</SelectItem>
						</SelectContent>
					</SelectTrigger>
				</Select>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<div className='flex flex-col gap-y-4 items-center justify-center w-full h-[350px]'>
						<FileSearch className='size-6 text-muted-foreground' />
						<p className='text-muted-foreground text-sm'>No data durning this period</p>
					</div>
				) : (
					<>
						{chartType === 'pie' && <PieVariant data={data} />}
						{chartType === 'radar' && <RadarVariant data={data} />}
						{/* {chartType === 'radio' && <LineVariant data={data} />} */}
					</>
				)}
			</CardContent>
		</Card>
	)
}
