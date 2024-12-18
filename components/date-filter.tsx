'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateRange } from '@/lib/utils'
import dayjs from '@/lib/dayjs'
import { ChevronDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useState } from 'react'
import { type DateRange } from 'react-day-picker'

export const DateFilter = () => {
	const router = useRouter()

	const path = usePathname()

	const params = useSearchParams()
	const accountId = params.get('accountId')
	const from = params.get('from') || ''
	const to = params.get('to') || ''

	// 搜索默认从第一页开始
	const page = '1'
	const pageSize = params.get('pageSize') ?? '10'

	const defaultTo = dayjs().utc(true)
	const defaultFrom = defaultTo.utc(true).subtract(30, 'day').startOf('day')

	const paramState = {
		from: from ? dayjs(from).utc(true).toDate() : defaultFrom.toDate(),
		to: to ? dayjs(to).utc(true).toDate() : defaultTo.toDate(),
	}

	const [date, setDate] = useState<DateRange | undefined>(paramState)

	const pushToUrl = (dateRange: DateRange | undefined) => {
		const query = {
			accountId,
			from: dayjs(dateRange?.from || defaultFrom).format('YYYY-MM-DD'),
			to: dayjs(dateRange?.to || defaultTo).format('YYYY-MM-DD'),
			page,
			pageSize,
		}

		const url = qs.stringifyUrl(
			{
				url: path,
				query,
			},
			{
				skipEmptyString: true,
				skipNull: true,
			}
		)

		router.push(url)
	}

	const onReset = () => {
		setDate(undefined)
		pushToUrl(undefined)
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					className='flex h-9 w-full items-center justify-between rounded-md border-none bg-white/10 px-3 font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-transparent focus:ring-offset-0 lg:w-auto'
					size={'sm'}
					variant={'outline'}
					disabled={false}
				>
					<span>{formatDateRange(paramState)}</span>
					<ChevronDown className='ml-2 size-4 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0 lg:w-auto' align={'start'}>
				<Calendar
					defaultMonth={date?.from}
					selected={date}
					onSelect={setDate}
					mode={'range'}
					numberOfMonths={2}
					initialFocus
					disabled={false}
				/>
				<div className='flex w-full items-center gap-x-2 p-4'>
					<PopoverClose asChild>
						<Button
							className='w-full'
							variant={'outline'}
							onClick={onReset}
							disabled={!date?.from || !date?.to}
						>
							Reset
						</Button>
					</PopoverClose>
					<PopoverClose asChild>
						<Button
							className='w-full'
							onClick={() => pushToUrl(date)}
							disabled={!date?.from || !date?.to}
						>
							Apply
						</Button>
					</PopoverClose>
				</div>
			</PopoverContent>
		</Popover>
	)
}
