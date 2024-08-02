'use client'
import { useState } from 'react'
import { useMedia } from 'react-use'
import { usePathname, useRouter } from 'next/navigation'
import { NavMenuLink } from '@/components/NavMenuLink'
import { Sheet, SheetHeader, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const routes = [
	{
		label: 'Overview',
		href: '/',
	},
	{
		label: 'Transactions',
		href: '/transactions',
	},
	{
		label: 'Accounts',
		href: '/accounts',
	},
	{
		label: 'Categories',
		href: '/categories',
	},
	{
		label: 'Settings',
		href: '/settings',
	},
]

export const NavMenu = () => {
	const pathname = usePathname()

	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)

	const isMobile = useMedia('(max-width: 1024px)', false)

	const handleClick = (href: string) => {
		router.push(href)
		setIsOpen(false)
	}

	if (isMobile) {
		return (
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger>
					<Button
						className='font-normal border-none text-white hover:text-white bg-white/10 hover:bg-white/20 focus:bg-white/30 focus-visible:ring-offset-0 focus-visible:ring-transparent transition'
						variant={'outline'}
						size={'sm'}
					>
						<Menu className='size-4' />
					</Button>
				</SheetTrigger>
				<SheetContent className='px-2' side={'left'} aria-describedby='Menu list'>
					<SheetHeader>
						<SheetTitle>Menu</SheetTitle>
					</SheetHeader>
					<nav className='flex flex-col gap-y-2 pt-6'>
						{routes.map(route => (
							<Button
								className='w-full justify-start'
								onClick={() => handleClick(route.href)}
								variant={pathname === route.href ? 'secondary' : 'ghost'}
								key={route.href}
							>
								{route.label}
							</Button>
						))}
					</nav>
				</SheetContent>
			</Sheet>
		)
	}

	return (
		<nav className='hidden lg:flex lg:items-center lg:gap-x-2 overflow-x-auto'>
			{routes.map(route => (
				<NavMenuLink href={route.href} label={route.label} active={pathname === route.href} key={route.href} />
			))}
		</nav>
	)
}
