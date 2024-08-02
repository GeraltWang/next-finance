import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props {
	href: string
	label: string
	active?: boolean
}

export const NavMenuLink = ({ href, label, active }: Props) => {
	return (
		<Button
			className={cn(
				'w-full lg:w-auto lg:justify-between font-normal hover:bg-white/20 text-white hover:text-white border-none outline-none focus-visible:ring-offset-0 focus-visible:ring-transparent focus:bg-white/30 transition',
				active ? 'bg-white/10 text-white' : 'bg-transparent'
			)}
			asChild
			size={'sm'}
			variant={'outline'}
		>
			<Link href={href}>{label}</Link>
		</Button>
	)
}
