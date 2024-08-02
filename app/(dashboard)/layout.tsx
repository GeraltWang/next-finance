import { HeaderBar } from '@/components/HeaderBar'
import React from 'react'

const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<>
			<HeaderBar />
			<main className='px-3 lg:px-14'>{children}</main>
		</>
	)
}

export default DashboardLayout
