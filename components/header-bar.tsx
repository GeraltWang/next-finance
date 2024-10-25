interface Props {
	children?: React.ReactNode
}

export const HeaderBar = ({ children }: Props) => {
	return (
		<header className='bg-gradient-to-b from-blue-700 to-blue-400 px-4 py-8 pb-36 lg:px-14'>
			<div className='mx-auto max-w-screen-2xl'>{children}</div>
		</header>
	)
}
