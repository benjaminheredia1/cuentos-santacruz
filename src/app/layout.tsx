import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Cuentos de Guarayo · Voces Ancestrales',
    description: 'Relatos orales, memoria viva y cultura ancestral del pueblo Guarayo. Comparte y preserva voces que trascienden generaciones.',
    keywords: 'guarayo, cuentos, relatos orales, cultura indígena, amazonía boliviana, tradición oral, mitos, leyendas',
    authors: [{ name: 'Cuentos de Guarayo' }],
    openGraph: {
        title: 'Cuentos de Guarayo · Voces Ancestrales',
        description: 'Memoria oral y relatos ancestrales del pueblo Guarayo.',
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
                                <p>&copy; 2024 Cuentos de Guarayo · Voces Ancestrales. Preservando la memoria oral.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    )
}
