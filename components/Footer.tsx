import { FaGithub } from 'react-icons/fa'

export const Footer = () => {
	return (
		<footer className='bg-blue-600 text-white px-4 lg:px-14 py-8 mt-8'>
			<div className='max-w-screen-2xl mx-auto'>
				<div className='flex flex-col md:flex-row justify-between items-start mb-6'>
					<div>
						<h3 className='text-xl font-bold'>Next Finance</h3>
						<p className='text-sm mt-1'>Your trusted financial partner</p>
					</div>
					<div className='flex flex-col lg:flex-row items-center space-x-6 mt-4 lg:mt-0'>
						<nav className='flex flex-col lg:flex-row gap-4'>
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
								className='hover:text-blue-200 transition-colors'
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
