import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Cuentos Santa Cruz - Tradición y Cultura',
    description: 'Descubre y comparte los cuentos típicos de Santa Cruz de la Sierra, Bolivia. Una plataforma para preservar nuestra cultura y tradiciones.',
    keywords: 'cuentos, santa cruz, bolivia, cultura, tradición, literatura, cuentos infantiles',
    authors: [{ name: 'Cuentos Santa Cruz' }],
    openGraph: {
        title: 'Cuentos Santa Cruz - Tradición y Cultura',
        description: 'Descubre y comparte los cuentos típicos de Santa Cruz de la Sierra, Bolivia.',
        type: 'website',
        locale: 'es_BO',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </main>
                    <footer className="bg-white border-t border-gray-200 mt-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="text-center text-gray-600">
                                <p>&copy; 2024 Cuentos Santa Cruz. Preservando nuestra cultura y tradiciones.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    )
}
