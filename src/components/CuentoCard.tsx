'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Heart, Eye, Play, Volume2, Image as ImageIcon } from 'lucide-react'
import { Cuento } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { Trash, Pencil } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface CuentoCardProps {
    cuento: Cuento
    onLike?: (id: string) => void
    onView?: (id: string) => void
}

const CuentoCard: React.FC<CuentoCardProps> = ({ cuento, onLike, onView }) => {
    const { user } = useAuth()
    const handleLike = () => {
        if (onLike) {
            onLike(cuento.id)
        }
    }

    const handleView = () => {
        if (onView) {
            onView(cuento.id)
        }
    }

    const getCategoriaColor = (categoria: string) => {
        const colors = {
            tradicional: 'bg-primaryGuarayo-500 text-white',
            moderno: 'bg-guarayo-river text-white',
            infantil: 'bg-secondaryGuarayo-500 text-white',
            historico: 'bg-amber-700 text-white',
            leyenda: 'bg-purple-700 text-white',
            mito: 'bg-orange-600 text-white'
        }
        return colors[categoria as keyof typeof colors] || 'bg-gray-500 text-white'
    }

    const getCategoriaLabel = (categoria: string) => {
        const labels = {
            tradicional: 'Tradicional',
            moderno: 'Moderno',
            infantil: 'Infantil',
            historico: 'Histórico',
            leyenda: 'Leyenda',
            mito: 'Mito'
        }
        return labels[categoria as keyof typeof labels] || categoria
    }

    return (
        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primaryGuarayo-500 transition-colors line-clamp-2">
                            {cuento.titulo}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                            Por {cuento.autor}
                        </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoriaColor(cuento.categoria)}`}>
                        {getCategoriaLabel(cuento.categoria)}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Imagen de portada */}
                {cuento.imagen_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                            src={cuento.imagen_url}
                            alt={cuento.titulo}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}

                {/* Contenido del cuento */}
                <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
                    {cuento.contenido}
                </p>

                {/* Media controls */}
                <div className="flex items-center space-x-2">
                    {cuento.audio_url && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                        >
                            <Volume2 className="w-4 h-4" />
                            <span>Audio</span>
                        </Button>
                    )}
                    {cuento.video_url && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                        >
                            <Play className="w-4 h-4" />
                            <span>Video</span>
                        </Button>
                    )}
                </div>

                {/* Stats y acciones */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{cuento.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{cuento.visualizaciones}</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-400">
                        {formatDate(cuento.fecha_creacion)}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-2">
                    <Button
                        onClick={handleLike}
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    >
                        <Heart className="w-4 h-4 mr-2" />
                        Me gusta
                    </Button>
                    <Link href={`/cuento/${cuento.id}`} className="flex-1">
                        <Button
                            onClick={handleView}
                            className="w-full bg-primaryGuarayo-500 hover:bg-primaryGuarayo-600"
                            size="sm"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Leer
                        </Button>
                    </Link>
                    <Link href={`/cuento/${cuento.id}/editar`}>
                        <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default CuentoCard
