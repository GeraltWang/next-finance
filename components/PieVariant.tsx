import { CategoryTooltip } from '@/components/CategoryTooltip'
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { formatPercentage } from '@/lib/utils'
import { Cell, Legend, Pie, PieChart } from 'recharts'

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

export const PieVariant = ({ data }: Props) => {
	return (
		<ChartContainer config={chartConfig} className='h-[350px] w-full'>
			<PieChart accessibilityLayer data={data}>
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
												<span className='text-sm'>
													{formatPercentage(entry.payload.percent * 100)}
												</span>
											</div>
										</li>
									)
								})}
							</ul>
						)
					}}
				/>
				<ChartTooltip content={<CategoryTooltip />} />
				<Pie
					data={data}
					dataKey={'amount'}
					labelLine={false}
					cx={'50%'}
					cy={'50%'}
					outerRadius={90}
					innerRadius={60}
					paddingAngle={2}
					fill='#8884d8'
				>
					{data.map((_entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
			</PieChart>
		</ChartContainer>
	)
}
