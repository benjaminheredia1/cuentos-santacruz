'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { BookOpen, Plus, Home, Search, LogIn, LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const Header: React.FC = () => {
    const { user, signOut } = useAuth()

    return (
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-santa-cruz-green to-santa-cruz-red rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Cuentos Santa Cruz
                            </h1>
                            <p className="text-xs text-gray-500 -mt-1">
                                Tradición y Cultura
                            </p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="flex items-center space-x-1 text-gray-700 hover:text-santa-cruz-green transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Inicio</span>
                        </Link>
                        <Link
                            href="/cuentos"
                            className="flex items-center space-x-1 text-gray-700 hover:text-santa-cruz-green transition-colors"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Cuentos</span>
                        </Link>
                        <Link
                            href="/buscar"
                            className="flex items-center space-x-1 text-gray-700 hover:text-santa-cruz-green transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            <span>Buscar</span>
                        </Link>
                    </nav>

                    {/* CTA Button */}
                    <div className="flex items-center space-x-4">
                        {user && (
                            <Link href="/nuevo-cuento">
                                <Button className="bg-santa-cruz-green hover:bg-primary-600 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Cuento
                                </Button>
                            </Link>
                        )}
                        {!user && (
                            <Link href="/auth/login">
                                <Button variant="outline" className="flex items-center">
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Ingresar
                                </Button>
                            </Link>
                        )}
                        {user && (
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <UserIcon className="w-4 h-4 mr-1" />
                                    {user.email}
                                </div>
                                <Button variant="outline" onClick={() => signOut()} className="flex items-center">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Salir
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
