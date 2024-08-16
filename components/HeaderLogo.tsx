import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export const HeaderLogo = () => {
	return (
		<Link href={'/'}>
			<div className='hidden lg:flex lg:items-center'>
				<Image src={'/logo.svg'} width={70} height={32} alt='logo' />
				<p className='ml-2.5 text-2xl font-semibold text-white'>Next Finance</p>
			</div>
		</Link>
	)
}
