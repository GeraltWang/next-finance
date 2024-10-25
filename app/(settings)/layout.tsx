import { HeaderBar } from '@/components/header-bar'
import { HeaderLogo } from '@/components/header-logo'
import { NavMenu } from '@/components/nav-menu'
import { ClerkLoaded, UserButton } from '@clerk/nextjs'
import { CommonFooter } from '@/components/common-footer'

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
			<CommonFooter />
		</div>
	)
}

export default DashboardLayout
