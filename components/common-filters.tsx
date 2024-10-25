import { AccountFilter } from '@/components/account-filter'
import { DateFilter } from '@/components/date-filter'

export const CommonFilters = () => {
	return (
		<div className='flex flex-col items-center gap-y-2 lg:flex-row lg:gap-x-2 lg:gap-y-0'>
			<AccountFilter />
			<DateFilter />
		</div>
	)
}
