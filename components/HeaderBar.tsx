import React from 'react'
import { HeaderLogo } from '@/components/HeaderLogo'
import { NavMenu } from '@/components/NavMenu'
import { UserButton } from '@clerk/nextjs'

export const HeaderBar = () => {
	return (
		<header className='bg-gradient-to-b from-blue-700 to-blue-400 px-4 lg:px-14 py-8 pb-36'>
			<div className='max-w-screen-2xl mx-auto'>
				<div className='w-full flex justify-between items-center mb-14'>
					<div className='flex items-center lg:gap-x-16'>
						<HeaderLogo />
						<NavMenu />
					</div>
					<UserButton />
				</div>
			</div>
		</header>
	)
}
