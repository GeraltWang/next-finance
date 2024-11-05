import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/loading-spinner'

export const TransactionTableFallback = () => {
	return (
		<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader>
					<Skeleton className='h-8 w-48' />
				</CardHeader>
				<CardContent>
					<div className='flex h-[500px] w-full items-center justify-center'>
						<LoadingSpinner />
					</div>
				</CardContent>
			</Card>
		</section>
	)
}
