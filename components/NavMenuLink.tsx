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
				'w-full border-none font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0 lg:w-auto lg:justify-between',
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
