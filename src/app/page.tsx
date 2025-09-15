'use client'

import React from 'react'
import { useCuentos } from '@/hooks/useCuentos'
import CuentoCard from '@/components/CuentoCard'
import { Button } from '@/components/ui/button'
import { BookOpen, Heart, Eye, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
    const { cuentos, loading, error, likeCuento, incrementViews } = useCuentos()

    const handleLike = (id: string) => {
        likeCuento(id)
    }

    const handleView = (id: string) => {
        incrementViews(id)
    }

    const featuredCuentos = cuentos.slice(0, 6)
    const popularCuentos = [...cuentos].sort((a, b) => b.likes - a.likes).slice(0, 4)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryGuarayo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando cuentos...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error al cargar los cuentos: {error}</p>
                <Button onClick={() => window.location.reload()}>
                    Reintentar
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-16 bg-gradient-to-r from-primaryGuarayo-500 via-guarayo-light to-secondaryGuarayo-500 rounded-2xl">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Cuentos de Guarayo
                    </h1>
                    <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                        Preserva y comparte relatos y voces ancestrales del pueblo Guarayo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/nuevo-cuento">
                            <Button size="lg" className="bg-primaryGuarayo-500 hover:bg-primaryGuarayo-600">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Compartir Cuento
                            </Button>
                        </Link>
                        <Link href="/cuentos">
                            <Button size="lg" variant="outline" className="border-primaryGuarayo-500 text-primaryGuarayo-500 hover:bg-primaryGuarayo-500 hover:text-white">
                                Explorar Cuentos
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                    <BookOpen className="w-8 h-8 text-primaryGuarayo-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-gray-900">{cuentos.length}</h3>
                    <p className="text-gray-600">Cuentos Publicados</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                    <Heart className="w-8 h-8 text-secondaryGuarayo-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-gray-900">
                        {cuentos.reduce((sum, cuento) => sum + cuento.likes, 0)}
                    </h3>
                    <p className="text-gray-600">Me Gusta Totales</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                    <Eye className="w-8 h-8 text-guarayo-river mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-gray-900">
                        {cuentos.reduce((sum, cuento) => sum + cuento.visualizaciones, 0)}
                    </h3>
                    <p className="text-gray-600">Visualizaciones</p>
                </div>
            </section>

            {/* Featured Cuentos */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Cuentos Destacados</h2>
                    <Link href="/cuentos">
                        <Button variant="outline" className="border-primaryGuarayo-500 text-primaryGuarayo-500 hover:bg-primaryGuarayo-500 hover:text-white">
                            Ver Todos
                        </Button>
                    </Link>
                </div>

                {featuredCuentos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredCuentos.map((cuento) => (
                            <CuentoCard
                                key={cuento.id}
                                cuento={cuento}
                                onLike={handleLike}
                                onView={handleView}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No hay cuentos aún
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Sé el primero en compartir un relato ancestral
                        </p>
                        <Link href="/nuevo-cuento">
                            <Button className="bg-primaryGuarayo-500 hover:bg-primaryGuarayo-600">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Compartir Cuento
                            </Button>
                        </Link>
                    </div>
                )}
            </section>

            {/* Popular Cuentos */}
            {popularCuentos.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                            <TrendingUp className="w-8 h-8 text-primaryGuarayo-500 mr-3" />
                            Más Populares
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularCuentos.map((cuento) => (
                            <CuentoCard
                                key={cuento.id}
                                cuento={cuento}
                                onLike={handleLike}
                                onView={handleView}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-guarayo-river to-primaryGuarayo-500 rounded-2xl p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">
                    ¿Tienes un cuento que compartir?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                    Ayuda a preservar la memoria oral compartiendo los relatos que conoces
                </p>
                <Link href="/nuevo-cuento">
                    <Button size="lg" className="bg-white text-primaryGuarayo-500 hover:bg-gray-100">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Compartir Ahora
                    </Button>
                </Link>
            </section>
        </div>
    )
}
