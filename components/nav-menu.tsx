'use client'
import { useState } from 'react'
import { useMedia } from 'react-use'
import { usePathname, useRouter } from 'next/navigation'
import { NavMenuLink } from '@/components/nav-menu-link'
import { Sheet, SheetHeader, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { headerLinks } from '@/data'

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
				<SheetTrigger asChild>
					<Button
						className='border-none bg-white/10 font-normal text-white transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0'
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
						{headerLinks.map(route => (
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
		<nav className='hidden overflow-x-auto lg:flex lg:items-center lg:gap-x-2'>
			{headerLinks.map(route => (
				<NavMenuLink
					href={route.href}
					label={route.label}
					active={pathname === route.href}
					key={route.href}
				/>
			))}
		</nav>
	)
}
