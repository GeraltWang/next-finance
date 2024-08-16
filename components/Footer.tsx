import { FaGithub } from 'react-icons/fa'

export const Footer = () => {
	return (
		<footer className='mt-8 bg-blue-600 px-4 py-8 text-white lg:px-14'>
			<div className='mx-auto max-w-screen-2xl'>
				<div className='mb-6 flex flex-col items-start justify-between md:flex-row'>
					<div>
						<h3 className='text-xl font-bold'>Next Finance</h3>
						<p className='mt-1 text-sm'>Your trusted financial partner</p>
					</div>
					<div className='mt-4 flex flex-col items-center space-x-6 lg:mt-0 lg:flex-row'>
						<nav className='flex flex-col gap-4 lg:flex-row'>
							{/* <a
									href='https://your-blog-site.com'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-blue-200 transition-colors'
								>
									Blog
								</a>
								<a
									href='https://your-portfolio.com'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-blue-200 transition-colors'
								>
									Portfolio
								</a>
								<a
									href='https://your-projects.com'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-blue-200 transition-colors'
								>
									Projects
								</a> */}
							<a
								href='https://github.com/GeraltWang/next-finance'
								target='_blank'
								rel='noopener noreferrer'
								className='transition-colors hover:text-blue-200'
							>
								<FaGithub size={24} />
							</a>
						</nav>
					</div>
				</div>
				<div className='text-center text-sm'>
					<p>&copy; 2024 Next Finance. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}
