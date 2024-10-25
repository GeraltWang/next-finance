import dayjs from 'dayjs'
import { Calendar as CalendarIcon } from 'lucide-react'
import { SelectSingleEventHandler } from 'react-day-picker'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type Props = {
	value?: Date
	onChange?: SelectSingleEventHandler
	disabled?: boolean
}

export const DatePicker = ({ value, onChange, disabled }: Props) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					className={cn(
						'w-full justify-start text-left font-normal',
						!value && 'text-muted-foreground'
					)}
					variant={'outline'}
					disabled={disabled}
				>
					<CalendarIcon className='mr-2 size-4' />
					{value ? dayjs(value).format('YYYY-MM-DD') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Calendar
					mode={'single'}
					selected={value}
					onSelect={onChange}
					disabled={disabled}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
