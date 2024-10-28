import Image from 'next/image'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { SiJuejin } from 'react-icons/si'

export const CommonFooter = () => {
	return (
		<footer className='mt-8 bg-blue-600 px-4 py-8 text-white lg:px-14'>
			<div className='mx-auto max-w-screen-2xl'>
				<div className='mb-6 flex flex-col items-start justify-between sm:flex-row'>
					<div className='space-y-2'>
						<h3 className='text-xl font-bold'>Next Finance</h3>
						<p className='mt-1 text-sm'>Your trusted financial partner</p>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link href={'/privacy'}>Privacy Policy</Link>
							</li>
						</ul>
					</div>
					<div className='mt-4 flex w-full flex-col gap-3 sm:w-auto'>
						<nav className='flex flex-col items-end gap-4 sm:flex-row sm:justify-end'>
							<a
								href='https://github.com/GeraltWang/next-finance'
								target='_blank'
								rel='noopener noreferrer'
								className='transition-colors hover:text-blue-200'
							>
								<FaGithub size={24} />
							</a>
							<a
								href='https://juejin.cn/user/2788810275700846'
								target='_blank'
								rel='noopener noreferrer'
								className='transition-colors hover:text-blue-200'
							>
								<SiJuejin size={24} />
							</a>
						</nav>
						<ul className='flex flex-col items-end gap-2'>
							<li className='flex items-baseline gap-2 text-sm'>
								Powered by{' '}
								<a href='https://nextjs.org/' target='_blank' rel='noopener noreferrer'>
									<Image
										className='w-[60px]'
										src={'/next.svg'}
										width={100}
										height={40}
										alt={'Next.js'}
									/>
								</a>
							</li>
							<li className='flex items-baseline gap-2 text-sm'>
								Deployed on{' '}
								<a href='https://vercel.com/' target='_blank' rel='noopener noreferrer'>
									<Image
										className='w-[60px]'
										src={'/vercel.svg'}
										width={100}
										height={40}
										alt={'Vercel'}
									/>
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className='text-center text-sm'>
					<p>&copy; 2024 Next Finance. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}
