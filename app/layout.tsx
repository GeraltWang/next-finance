import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/providers/query-provider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { zhCN } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
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
					<NextTopLoader color='#FF7A00' />
					<QueryProvider>
						<Toaster richColors theme={'system'} />
						{children}
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryProvider>
					<Analytics />
					<SpeedInsights />
				</body>
			</html>
		</ClerkProvider>
	)
}
