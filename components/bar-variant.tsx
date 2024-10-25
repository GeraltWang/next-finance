import { XAxis, BarChart, Bar, CartesianGrid } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { CustomTooltip } from '@/components/custom-tooltip'
import dayjs from 'dayjs'

const chartConfig = {
	income: {
		label: 'Income',
		color: '#3d82f6',
	},
	expenses: {
		label: 'Expenses',
		color: '#f43f5e',
	},
} satisfies ChartConfig

type Props = {
	data: { date: string; income: number; expenses: number }[]
}

export const BarVariant = ({ data }: Props) => {
	return (
		<ChartContainer config={chartConfig} className='h-[350px] w-full'>
			<BarChart accessibilityLayer data={data}>
				<CartesianGrid strokeDasharray={'3 3'} />
				<ChartTooltip content={<CustomTooltip />} />
				<Bar className='drop-shadow-sm' dataKey='income' fill='var(--color-income)' radius={4} />
				<Bar
					className='drop-shadow-sm'
					dataKey='expenses'
					fill='var(--color-expenses)'
					radius={4}
				/>
				<XAxis
					axisLine={false}
					tickLine={false}
					dataKey={'date'}
					tickMargin={16}
					tickFormatter={value => dayjs(value).format('DD MMM')}
					style={{ fontSize: '12px' }}
				/>
			</BarChart>
		</ChartContainer>
	)
}
