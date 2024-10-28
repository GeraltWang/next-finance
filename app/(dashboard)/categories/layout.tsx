import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Categories - Next Finance',
	description: 'Manage your income/expense categories',
}

const SubLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return <>{children}</>
}

export default SubLayout
