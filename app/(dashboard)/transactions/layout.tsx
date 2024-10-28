import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Transactions - Next Finance',
	description: 'Manage your transactions',
}

const SubLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return <>{children}</>
}

export default SubLayout
