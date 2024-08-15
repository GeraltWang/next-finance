import { HeaderBar } from '@/components/HeaderBar'
import { Footer } from '@/components/Footer'

const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<>
			<HeaderBar />
			<main className='px-3 lg:px-14'>{children}</main>
			<Footer />
		</>
	)
}

export default DashboardLayout
