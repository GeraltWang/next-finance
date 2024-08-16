import { QueryProvider } from '@/providers/query-provider'
import { zhCN } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Next Finance',
	description: 'Manage your finance with ease',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider localization={zhCN}>
			<html lang='zh-CN'>
				<body className={inter.className}>
					<QueryProvider>
						<Toaster />
						{children}
					</QueryProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
