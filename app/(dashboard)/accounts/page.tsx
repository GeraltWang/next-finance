'use client'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete-accounts'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'
import { Loader2, Plus } from 'lucide-react'
import { TableColumns } from '@/features/accounts/components/table-columns'

const AccountsPage = () => {
	const { onOpen } = useNewAccount()

	const { data, isLoading } = useGetAccounts()

	const accounts = data || []

	const deleteAccounts = useBulkDeleteAccounts()

	const isDisabled = isLoading || deleteAccounts.isPending

	if (isLoading) {
		return (
			<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
				<Card className='border-none drop-shadow-sm'>
					<CardHeader>
						<Skeleton className='h-8 w-48' />
					</CardHeader>
					<CardContent>
						<div className='flex h-[500px] w-full items-center justify-center'>
							<Loader2 className='size-6 animate-spin text-slate-300' />
						</div>
					</CardContent>
				</Card>
			</section>
		)
	}

	return (
		<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='line-clamp-1 text-xl'>Accounts</CardTitle>
					<Button size={'sm'} onClick={onOpen}>
						<Plus className='mr-2 size-4' />
						Add New Account
					</Button>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={TableColumns}
						data={accounts}
						filterKey='name'
						disabled={isDisabled}
						onDelete={row => {
							const ids = row.map(r => r.original.id)
							deleteAccounts.mutate({ ids })
						}}
					/>
				</CardContent>
			</Card>
		</section>
	)
}

export default AccountsPage
