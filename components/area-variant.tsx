import { XAxis, AreaChart, Area, CartesianGrid } from 'recharts'
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

export const AreaVariant = ({ data }: Props) => {
	return (
		<ChartContainer className='h-[350px] w-full' config={chartConfig}>
			<AreaChart data={data}>
				<CartesianGrid strokeDasharray={'3 3'}></CartesianGrid>
				<defs>
					<linearGradient id='income' x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
						<stop offset={'2%'} stopColor='#3d82f6' stopOpacity={0.8} />
						<stop offset={'98%'} stopColor='#3d82f6' stopOpacity={0} />
					</linearGradient>
					<linearGradient id='expenses' x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
						<stop offset={'2%'} stopColor='#f43f5e' stopOpacity={0} />
						<stop offset={'98%'} stopColor='#f43f5e' stopOpacity={0.8} />
					</linearGradient>
				</defs>
				<ChartTooltip content={<CustomTooltip />} />
				<Area
					className='drop-shadow-sm'
					dataKey={'income'}
					type={'monotone'}
					stackId={'income'}
					strokeWidth={2}
					stroke={'#3d82f6'}
					fill={'url(#income)'}
				/>
				<Area
					className='drop-shadow-sm'
					dataKey={'expenses'}
					type={'monotone'}
					stackId={'expenses'}
					strokeWidth={2}
					stroke={'#f43f5e'}
					fill={'url(#expenses)'}
				/>
				<XAxis
					axisLine={false}
					tickLine={false}
					dataKey={'date'}
					tickMargin={16}
					tickFormatter={value => dayjs(value).format('DD MMM')}
					style={{ fontSize: '12px' }}
				/>
			</AreaChart>
		</ChartContainer>
	)
}
