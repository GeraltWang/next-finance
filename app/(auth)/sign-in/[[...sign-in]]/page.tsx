import React from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { SignIn, ClerkLoading, ClerkLoaded } from '@clerk/nextjs'

const SignInPage = () => {
	return (
		<main className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
			<section className='h-full lg:flex flex-col items-center justify-center px-4'>
				<div className='text-center space-y-4 pt-16'>
					<h1 className='font-bold text-3xl text-[#2e2a47]'>Welcome Back</h1>
					<p className='text-base text-[#7e8ca0]'>Login or create account to get back to your dashboard.</p>
				</div>
				<div className='flex justify-center items-center mt-8'>
					<ClerkLoaded>
						<SignIn />
					</ClerkLoaded>
					<ClerkLoading>
						<Loader2 size='48' className='animate-spin text-[#2e2a47]' />
					</ClerkLoading>
				</div>
			</section>
			<section className='h-full bg-blue-600 hidden lg:flex lg:justify-center lg:items-center'>
				<Image src={'/logo.svg'} width={100} height={50} alt='logo' />
			</section>
		</main>
	)
}

export default SignInPage
