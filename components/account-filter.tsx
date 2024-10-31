'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useGetSummary } from '@/features/summary/api/use-get-summary'
import { formUrlQuery } from '@/lib/query'

export const AccountFilter = () => {
	const router = useRouter()

	const params = useSearchParams()

	const accountId = params.get('accountId') || 'all'
	const from = params.get('from') || ''
	const to = params.get('to') || ''

	const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts()

	const onChange = (newValue: string) => {
		const queryParams = {
			accountId: newValue,
			from,
			to,
		}

		if (newValue === 'all') {
			queryParams.accountId = ''
		}

		const url = formUrlQuery({ params: params.toString(), queryParams })

		router.push(url)
	}

	const { isLoading: isLoadingSummary } = useGetSummary()

	return (
		<Select
			value={accountId}
			onValueChange={onChange}
			disabled={isLoadingAccounts || isLoadingSummary}
		>
			<SelectTrigger className='h-9 w-full rounded-md border-none bg-white/10 px-3 font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-transparent focus:ring-offset-0 lg:w-auto'>
				<SelectValue placeholder={'Select account'} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={'all'}>All accounts</SelectItem>
				{accounts?.map(account => (
					<SelectItem key={account.id} value={account.id}>
						{account.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
