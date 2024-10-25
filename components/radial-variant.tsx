import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { formatCurrency } from '@/lib/utils'
import { Legend, RadialBar, RadialBarChart } from 'recharts'

type Props = {
	data: { name: string; amount: number }[]
}

const chartConfig = {
	amount: {
		label: 'Amount',
		color: '#3d82f6',
	},
} satisfies ChartConfig

const COLORS = ['#0062ff', '#12c6ff', '#ff647f', '#ff9354']

export const RadialVariant = ({ data }: Props) => {
	return (
		<ChartContainer config={chartConfig} className='h-[350px] w-full'>
			<RadialBarChart
				accessibilityLayer
				data={data.map((item, index) => {
					return {
						...item,
						fill: COLORS[index % COLORS.length],
					}
				})}
				barSize={10}
				innerRadius={'90%'}
				outerRadius={'40%'}
				cx={'50%'}
				cy={'30%'}
			>
				<RadialBar
					dataKey={'amount'}
					label={{
						position: 'insideStart',
						fill: '#fff',
						fontSize: '12px',
					}}
					background
				/>
				<Legend
					layout={'horizontal'}
					verticalAlign={'bottom'}
					align={'right'}
					iconType={'circle'}
					content={({ payload }: any) => {
						return (
							<ul className='flex flex-col space-y-2'>
								{payload.map((entry: any, index: number) => {
									return (
										<li key={`item-${index}`} className='flex items-center space-x-2'>
											<span
												className='size-2 rounded-full'
												style={{ backgroundColor: entry.color }}
											/>
											<div className='space-x-1'>
												<span className='text-sm text-muted-foreground'>{entry.value}</span>
												<span className='text-sm'>{formatCurrency(entry.payload.value)}</span>
											</div>
										</li>
									)
								})}
							</ul>
						)
					}}
				/>
			</RadialBarChart>
		</ChartContainer>
	)
}
