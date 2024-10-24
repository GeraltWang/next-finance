'use client'
import { buttonVariants } from '@/components/ui/button'
import { settingsLinks } from '@/data'
import { cn } from '@/lib/utils'
import Link from 'next/link'
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
