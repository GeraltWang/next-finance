import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

type Props = {
	data: { name: string; amount: number }[]
}

const chartConfig = {
	amount: {
		label: 'Amount',
		color: '#3d82f6',
	},
} satisfies ChartConfig

export const RadarVariant = ({ data }: Props) => {
	return (
		<ChartContainer config={chartConfig} className='h-[350px] w-full'>
			<RadarChart data={data} cx={'50%'} cy={'50%'} outerRadius={'60%'}>
				<PolarGrid />
				<PolarAngleAxis style={{ fontSize: '12px' }} dataKey='name' />
				<PolarRadiusAxis style={{ fontSize: '12px' }} />
				<Radar
					dataKey={'amount'}
					stroke={'var(--color-amount)'}
					fill={'var(--color-amount)'}
					fillOpacity={0.6}
				/>
			</RadarChart>
		</ChartContainer>
	)
}
