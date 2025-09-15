'use client'

import React, { useState } from 'react'
import { useCuentos } from '@/hooks/useCuentos'
import CuentoCard from '@/components/CuentoCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Search, Filter, TrendingUp, Calendar, Heart } from 'lucide-react'

export default function BuscarPage() {
    const { cuentos, loading, error, likeCuento, incrementViews } = useCuentos()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategoria, setSelectedCategoria] = useState('')
    const [sortBy, setSortBy] = useState('relevancia')

    const handleLike = (id: string) => {
        likeCuento(id)
    }

    const handleView = (id: string) => {
        incrementViews(id)
    }

    // Filtrar y ordenar cuentos
    const filteredCuentos = cuentos
        .filter(cuento => {
            const matchesSearch = cuento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cuento.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cuento.autor.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategoria = !selectedCategoria || cuento.categoria === selectedCategoria
            return matchesSearch && matchesCategoria
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'relevancia':
                    // Ordenar por relevancia (títulos que coinciden primero)
                    const aTitleMatch = a.titulo.toLowerCase().includes(searchTerm.toLowerCase())
                    const bTitleMatch = b.titulo.toLowerCase().includes(searchTerm.toLowerCase())
                    if (aTitleMatch && !bTitleMatch) return -1
                    if (!aTitleMatch && bTitleMatch) return 1
                    return b.likes - a.likes
                case 'fecha':
                    return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
                case 'likes':
                    return b.likes - a.likes
                case 'visualizaciones':
                    return b.visualizaciones - a.visualizaciones
                case 'titulo':
                    return a.titulo.localeCompare(b.titulo)
                default:
                    return 0
            }
        })

    const categorias = [
        { value: '', label: 'Todas las categorías' },
        { value: 'tradicional', label: 'Tradicional' },
        { value: 'moderno', label: 'Moderno' },
        { value: 'infantil', label: 'Infantil' },
        { value: 'historico', label: 'Histórico' },
        { value: 'leyenda', label: 'Leyenda' },
        { value: 'mito', label: 'Mito' }
    ]

    const sortOptions = [
        { value: 'relevancia', label: 'Más relevante' },
        { value: 'fecha', label: 'Más recientes' },
        { value: 'likes', label: 'Más populares' },
        { value: 'visualizaciones', label: 'Más vistos' },
        { value: 'titulo', label: 'A-Z' }
    ]

    const categoriasStats = categorias.slice(1).map(cat => {
        const count = cuentos.filter(c => c.categoria === cat.value).length
        return { ...cat, count }
    })

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
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Buscar Cuentos
                </h1>
                <p className="text-xl text-gray-600">
                    Encuentra relatos vivos del pueblo Guarayo
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filtros laterales */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Filter className="w-5 h-5 text-primaryGuarayo-500 mr-2" />
                            Filtros
                        </h3>

                        <div className="space-y-6">
                            {/* Búsqueda */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Título, autor, contenido..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Categoría */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría
                                </label>
                                <Select
                                    value={selectedCategoria}
                                    onChange={(e) => setSelectedCategoria(e.target.value)}
                                >
                                    {categorias.map(categoria => (
                                        <option key={categoria.value} value={categoria.value}>
                                            {categoria.label}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* Ordenar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ordenar por
                                </label>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* Limpiar filtros */}
                            {(searchTerm || selectedCategoria) && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('')
                                        setSelectedCategoria('')
                                    }}
                                    className="w-full"
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>

                        {/* Estadísticas por categoría */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                                Cuentos por categoría
                            </h4>
                            <div className="space-y-2">
                                {categoriasStats.map(cat => (
                                    <div
                                        key={cat.value}
                                        className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                                        onClick={() => setSelectedCategoria(cat.value)}
                                    >
                                        <span className={selectedCategoria === cat.value ? 'text-primaryGuarayo-600 font-medium' : ''}>
                                            {cat.label}
                                        </span>
                                        <span className="text-gray-500">{cat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resultados */}
                <div className="lg:col-span-3">
                    {/* Info de resultados */}
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600">
                                Mostrando {filteredCuentos.length} de {cuentos.length} cuentos
                                {searchTerm && ` para "${searchTerm}"`}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <TrendingUp className="w-4 h-4" />
                                <span>Ordenado por {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lista de cuentos */}
                    {filteredCuentos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredCuentos.map((cuento) => (
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
                            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No se encontraron cuentos
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || selectedCategoria
                                    ? 'Intenta con otros términos de búsqueda o filtros'
                                    : 'No hay cuentos disponibles en este momento'
                                }
                            </p>
                            {(searchTerm || selectedCategoria) && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('')
                                        setSelectedCategoria('')
                                    }}
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
