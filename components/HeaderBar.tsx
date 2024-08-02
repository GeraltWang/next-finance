import { ClerkLoading, ClerkLoaded } from '@clerk/nextjs'
import { HeaderLogo } from '@/components/HeaderLogo'
import { NavMenu } from '@/components/NavMenu'
import { UserButton } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { WelcomeMsg } from './WelcomeMsg'

export const HeaderBar = () => {
	return (
		<header className='bg-gradient-to-b from-blue-700 to-blue-400 px-4 lg:px-14 py-8 pb-36'>
			<div className='max-w-screen-2xl mx-auto'>
				<div className='w-full flex justify-between items-center mb-14'>
					<div className='flex items-center lg:gap-x-16'>
						<HeaderLogo />
						<NavMenu />
					</div>
					<ClerkLoaded>
						<UserButton />
					</ClerkLoaded>
					<ClerkLoading>
						<Loader2 className='size-8 text-slate-400 animate-spin' />
					</ClerkLoading>
				</div>
				<WelcomeMsg />
			</div>
		</header>
	)
}
