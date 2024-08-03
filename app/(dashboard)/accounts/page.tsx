'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { DataTable } from '@/components/DataTable'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'

const AccountsPage = () => {
	const { onOpen } = useNewAccount()

	const { data } = useGetAccounts()

	const accounts = data || []

	return (
		<section className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='text-xl line-clamp-1'>Accounts</CardTitle>
					<Button size={'sm'} onClick={onOpen}>
						<Plus className='size-4 mr-2' />
						Add New Account
					</Button>
				</CardHeader>
				<CardContent>
					<DataTable columns={columns} data={accounts} filterKey='email' />
				</CardContent>
			</Card>
		</section>
	)
}

export default AccountsPage
