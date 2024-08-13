import { cn, formatCurrency, formatPercentage } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CountUp } from '@/components/CountUp'
import { type IconType } from 'react-icons'

const boxVariant = cva('rounded-md p-3', {
	variants: {
		variant: {
			default: 'bg-blue-500/20',
			success: 'bg-emerald-500/20',
			danger: 'bg-rose-500/20',
			warning: 'bg-yellow-500/20',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

const iconVariant = cva('size-6', {
	variants: {
		variant: {
			default: 'fill-blue-500',
			success: 'fill-emerald-500',
			danger: 'fill-rose-500',
			warning: 'fill-yellow-500',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

type BoxVariants = VariantProps<typeof boxVariant>
type IconVariants = VariantProps<typeof iconVariant>

interface Props extends BoxVariants, IconVariants {
	header: string
	value?: number
	dateRange: string
	percentageChange?: number
	icon: IconType
}

export const DataCard = ({ header, dateRange, value = 0, percentageChange = 0, variant, icon: Icon }: Props) => {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between gap-x-4'>
				<div className='space-y-2'>
					<CardTitle className='text-2xl line-clamp-1'>{header}</CardTitle>
					<CardDescription className='line-clamp-1'>{dateRange}</CardDescription>
				</div>
				<div className={cn(boxVariant({ variant }))}>
					<Icon className={cn(iconVariant({ variant }))} />
				</div>
			</CardHeader>
			<CardContent>
				<h1 className='font-bold text-2xl mb-2 line-clamp-1 break-all'>
					<CountUp preserveValue start={0} end={value} decimals={2} decimalPlaces={2} formattingFn={formatCurrency} />
				</h1>
				<p
					className={cn(
						'text-muted-foreground text-sm line-clamp-1',
						percentageChange > 0 ? 'text-emerald-500' : 'text-red-500'
					)}
				>
					{formatPercentage(percentageChange)} from last period
				</p>
			</CardContent>
		</Card>
	)
}

export const DataCardLoading = () => {
	return (
		<Card className='border-none drop-shadow-sm h-[192px]'>
			<CardHeader className='flex flex-row items-center justify-between gap-x-4'>
				<div className='space-y-2'>
					<Skeleton className='w-24 h-6' />
					<Skeleton className='w-20 h-4' />
				</div>
				<Skeleton className='size-12' />
			</CardHeader>
			<CardContent>
				<Skeleton className='shrink-0 w-24 h-10 mb-2' />
				<Skeleton className='shrink-0 w-40 h-4' />
			</CardContent>
		</Card>
	)
}
