import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeInitializer } from '@/components/ThemeInitializer'
import { GlobalLoader } from '@/components/GlobalLoader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'License Management System',
  description: 'Manage licenses and subscriptions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeInitializer />
        <GlobalLoader />
        {children}
      </body>
    </html>
  )
}

