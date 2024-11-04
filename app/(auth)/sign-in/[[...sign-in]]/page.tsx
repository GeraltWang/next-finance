import Image from 'next/image'
import { SignIn, ClerkLoading, ClerkLoaded } from '@clerk/nextjs'
import { LoadingSpinner } from '@/components/loading-spinner'

const SignInPage = () => {
	return (
		<main className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
			<section className='h-full flex-col items-center justify-center px-4 lg:flex'>
				<div className='space-y-4 pt-16 text-center'>
					<h1 className='text-3xl font-bold text-[#2e2a47]'>Welcome Back</h1>
					<p className='text-base text-[#7e8ca0]'>
						Login or create account to get back to your dashboard.
					</p>
				</div>
				<div className='mt-8 flex items-center justify-center'>
					<ClerkLoaded>
						<SignIn signUpFallbackRedirectUrl='/welcome' signUpForceRedirectUrl='/welcome' />
					</ClerkLoaded>
					<ClerkLoading>
						<LoadingSpinner />
					</ClerkLoading>
				</div>
			</section>
			<section className='hidden h-full bg-blue-600 lg:flex lg:items-center lg:justify-center'>
				<Image src={'/logo.svg'} width={100} height={50} alt='logo' />
			</section>
		</main>
	)
}

export default SignInPage
