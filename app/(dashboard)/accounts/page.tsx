'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'
import { Plus } from 'lucide-react'
import { Payment, columns } from './columns'
import { DataTable } from '@/components/DataTable'

const data: Payment[] = [
	{
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '728ed52f',
		amount: 100,
		status: 'success',
		email: 'a@example.com',
	},
]

async function getData(): Promise<Payment[]> {
	// Fetch data from your API here.
	return [
		{
			id: '728ed52f',
			amount: 100,
			status: 'pending',
			email: 'm@example.com',
		},
		// ...
	]
}

const AccountsPage = () => {
	const { onOpen } = useNewAccount()

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
					<DataTable columns={columns} data={data} filterKey='email' />
				</CardContent>
			</Card>
		</section>
	)
}

export default AccountsPage
