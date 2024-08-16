import { Filters } from '@/components/Filters'
import { HeaderLogo } from '@/components/HeaderLogo'
import { NavMenu } from '@/components/NavMenu'
import { WelcomeMsg } from '@/components/WelcomeMsg'
import { ClerkLoaded, UserButton } from '@clerk/nextjs'

export const HeaderBar = () => {
	return (
		<header className='bg-gradient-to-b from-blue-700 to-blue-400 px-4 py-8 pb-36 lg:px-14'>
			<div className='mx-auto max-w-screen-2xl'>
				<div className='mb-14 flex w-full items-center justify-between'>
					<div className='flex items-center lg:gap-x-16'>
						<HeaderLogo />
						<NavMenu />
					</div>
					<ClerkLoaded>
						<UserButton />
					</ClerkLoaded>
				</div>
				<WelcomeMsg />
				<Filters />
			</div>
		</header>
	)
}
