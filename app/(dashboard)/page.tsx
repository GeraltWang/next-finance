import { SummaryBlock } from '@/features/summary/components/summary-block'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Overview - Next Finance',
	description: 'Your financial overview report',
}

export default function OverviewPage() {
	return (
		<div className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
			<SummaryBlock />
		</div>
	)
}
