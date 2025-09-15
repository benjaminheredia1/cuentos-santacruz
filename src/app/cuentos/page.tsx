'use client'

import React, { useState } from 'react'
import { useCuentos } from '@/hooks/useCuentos'
import CuentoCard from '@/components/CuentoCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Search, Filter, Grid, List } from 'lucide-react'

export default function CuentosPage() {
    const { cuentos, loading, error, likeCuento, incrementViews } = useCuentos()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategoria, setSelectedCategoria] = useState('')
    const [sortBy, setSortBy] = useState('fecha')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
        { value: 'fecha', label: 'Más recientes' },
        { value: 'likes', label: 'Más populares' },
        { value: 'visualizaciones', label: 'Más vistos' },
        { value: 'titulo', label: 'A-Z' }
    ]

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
                    Todos los Cuentos
                </h1>
                <p className="text-xl text-gray-600">
                    Descubre y preserva la memoria oral Guarayo
                </p>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar cuentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Categoría */}
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

                    {/* Ordenar */}
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

                    {/* Vista */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Resultados */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <p>
                        Mostrando {filteredCuentos.length} de {cuentos.length} cuentos
                    </p>
                    {(searchTerm || selectedCategoria) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedCategoria('')
                            }}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            </div>

            {/* Lista de cuentos */}
            {filteredCuentos.length > 0 ? (
                <div className={
                    viewMode === 'grid'
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                }>
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
    )
}
