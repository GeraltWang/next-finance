import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Accounts - Next Finance',
	description: 'Manage your transaction accounts',
}

const SubLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return <>{children}</>
}

export default SubLayout
