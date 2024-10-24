import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { SettingsNavMenu } from '@/components/settings-nav-menu'

const SettingsSubLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='line-clamp-1 text-xl'>Settings</CardTitle>
					<CardDescription>Manage your account settings</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
						<aside className='lg:w-1/5'>
							<SettingsNavMenu />
						</aside>
						<div className='flex-1'>{children}</div>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}

export default SettingsSubLayout
