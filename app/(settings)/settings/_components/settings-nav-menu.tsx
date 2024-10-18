'use client'
import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { settingsLinks } from '@/constants'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export const SettingsNavMenu = () => {
	const pathname = usePathname()
	return (
		<nav className='flex lg:flex-col'>
			{settingsLinks.map(route => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						pathname === route.href
							? 'bg-muted hover:bg-muted'
							: 'hover:bg-transparent hover:underline',
						'justify-start'
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	)
}
