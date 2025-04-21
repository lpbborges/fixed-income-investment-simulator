import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'swap',
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Simulador de investimentos em renda fixa',
	description:
		'Simule o rendimento de investimentos em renda fixa e descubra quanto seu dinheiro pode crescer com diferentes taxas e prazos. Use nossa calculadora para planejar seus ganhos com segurança!',
	robots: 'index, follow',
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
			>
				{children}
				<SpeedInsights />
			</body>
		</html>
	)
}
