import { XAxis, LineChart, Line, CartesianGrid } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { CustomTooltip } from '@/components/CustomTooltip'
import { format } from 'date-fns'

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

export const LineVariant = ({ data }: Props) => {
	return (
		<ChartContainer config={chartConfig} className='h-[350px] w-full'>
			<LineChart accessibilityLayer data={data}>
				<CartesianGrid strokeDasharray={'3 3'} />
				<ChartTooltip content={<CustomTooltip />} />
				<Line className='drop-shadow-sm' dataKey='income' stroke='var(--color-income)' strokeWidth={2} dot={false} />
				<Line
					className='drop-shadow-sm'
					dataKey='expenses'
					stroke='var(--color-expenses)'
					strokeWidth={2}
					dot={false}
				/>
				<XAxis
					axisLine={false}
					tickLine={false}
					dataKey={'date'}
					tickMargin={16}
					tickFormatter={value => format(value, 'dd MMM')}
					style={{ fontSize: '12px' }}
				/>
			</LineChart>
		</ChartContainer>
	)
}
