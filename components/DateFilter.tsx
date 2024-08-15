'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateRange } from '@/lib/utils'
import { format, subDays } from 'date-fns'
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

	const defaultTo = new Date()
	const defaultFrom = subDays(defaultTo, 30)

	const paramState = {
		from: from ? new Date(from) : defaultFrom,
		to: to ? new Date(to) : defaultTo,
	}

	const [date, setDate] = useState<DateRange | undefined>(paramState)

	const pushToUrl = (dateRange: DateRange | undefined) => {
		const query = {
			accountId,
			from: format(dateRange?.from || defaultFrom, 'yyyy-MM-dd'),
			to: format(dateRange?.to || defaultTo, 'yyyy-MM-dd'),
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
					className='w-full lg:w-auto h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 focus:bg-white/30 text-white hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none transition'
					size={'sm'}
					variant={'outline'}
					disabled={false}
				>
					<span>{formatDateRange(paramState)}</span>
					<ChevronDown className='size-4 ml-2 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full lg:w-auto p-0' align={'start'}>
				<Calendar
					defaultMonth={date?.from}
					selected={date}
					onSelect={setDate}
					mode={'range'}
					numberOfMonths={2}
					initialFocus
					disabled={false}
				/>
				<div className='flex w-full p-4 items-center gap-x-2'>
					<PopoverClose asChild>
						<Button className='w-full' variant={'outline'} onClick={onReset} disabled={!date?.from || !date?.to}>
							Reset
						</Button>
					</PopoverClose>
					<PopoverClose asChild>
						<Button className='w-full' onClick={() => pushToUrl(date)} disabled={!date?.from || !date?.to}>
							Apply
						</Button>
					</PopoverClose>
				</div>
			</PopoverContent>
		</Popover>
	)
}
