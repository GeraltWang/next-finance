import { HeaderBar } from '@/components/HeaderBar'
import { Footer } from '@/components/Footer'

const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<div className='flex h-screen flex-col'>
			<HeaderBar />
			<main className='flex-1 px-3 lg:px-14'>{children}</main>
			<Footer />
		</div>
	)
}

export default DashboardLayout
