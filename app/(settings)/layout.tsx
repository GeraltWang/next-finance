import { HeaderBar } from '@/components/HeaderBar'
import { HeaderLogo } from '@/components/HeaderLogo'
import { NavMenu } from '@/components/NavMenu'
import { ClerkLoaded, UserButton } from '@clerk/nextjs'
import { Footer } from '@/components/Footer'
// import { SheetProvider } from '@/providers/sheet-provider'

const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<div className='flex h-screen flex-col'>
			<HeaderBar>
      <div className='mb-14 flex w-full items-center justify-between'>
					<div className='flex items-center lg:gap-x-16'>
						<HeaderLogo />
						<NavMenu />
					</div>
					<ClerkLoaded>
						<UserButton />
					</ClerkLoaded>
				</div>
      </HeaderBar>
			<main className='flex-1 px-3 lg:px-14'>{children}</main>
			<Footer />
			{/* <SheetProvider /> */}
		</div>
	)
}

export default DashboardLayout
