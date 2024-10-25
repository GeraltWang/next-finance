'use client'
import { DataTable } from '@/components/data-table'
import { TableColumns } from '@/features/pat/components/table-columns'
import { useGetPats } from '@/features/pat/api/use-get-pats'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NewPatDialog } from '@/features/pat/components/new-pat-dialog'
import { useNewPat } from '@/features/pat/hooks/use-new-pat'

const SettingsPage = () => {
	const { data, isLoading } = useGetPats()

	const pats = data || []

	const { onOpen } = useNewPat()

	const handleGenerate = async () => {
		onOpen()
	}

	if (isLoading) {
		return (
			<>
				<div className='mb-8'>
					<h3 className='text-lg font-medium'>Manage personal access token</h3>
					<p className='text-sm text-muted-foreground'>
						You can manage your personal access token here.
					</p>
				</div>
				<Skeleton className='h-8 w-48' />
				<div className='flex h-[400px] w-full items-center justify-center'>
					<Loader2 className='size-6 animate-spin text-slate-300' />
				</div>
			</>
		)
	}

	return (
		<>
			<NewPatDialog />
			<div className='mb-8'>
				<h3 className='text-lg font-medium'>Manage personal access token</h3>
				<p className='text-sm text-muted-foreground'>
					You can manage your personal access token here.
				</p>
			</div>
			<Button size={'sm'} onClick={handleGenerate}>
				<Plus className='mr-2 size-4' />
				Generate New Token
			</Button>
			<DataTable filterKey='name' columns={TableColumns} data={pats} />
		</>
	)
}

export default SettingsPage
