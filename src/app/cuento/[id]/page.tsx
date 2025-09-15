'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Cuento } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Heart, Eye, Share2, Play, Volume2, Calendar, User, Tag, Pencil, Trash } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function CuentoDetailPage() {
    const { user } = useAuth()
    const params = useParams()
    const router = useRouter()
    const [cuento, setCuento] = useState<Cuento | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [liked, setLiked] = useState(false)

    const cuentoId = params.id as string

    useEffect(() => {
        if (cuentoId) {
            fetchCuento()
        }
    }, [cuentoId])

    const fetchCuento = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('cuentos')
                .select('*')
                .eq('id', cuentoId)
                .single()

            if (error) throw error
            setCuento(data)

            // Incrementar visualizaciones
            if (data) {
                await supabase
                    .from('cuentos')
                    .update({ visualizaciones: data.visualizaciones + 1 })
                    .eq('id', cuentoId)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar el cuento')
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async () => {
        if (!cuento) return

        try {
            const newLikes = liked ? cuento.likes - 1 : cuento.likes + 1

            const { error } = await supabase
                .from('cuentos')
                .update({ likes: newLikes })
                .eq('id', cuentoId)

            if (error) throw error

            setCuento(prev => prev ? { ...prev, likes: newLikes } : null)
            setLiked(!liked)
        } catch (err) {
            console.error('Error al dar like:', err)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: cuento?.titulo,
                    text: cuento?.contenido.substring(0, 100) + '...',
                    url: window.location.href
                })
            } catch (err) {
                console.log('Error al compartir:', err)
            }
        } else {
            // Fallback: copiar al portapapeles
            navigator.clipboard.writeText(window.location.href)
            alert('Enlace copiado al portapapeles')
        }
    }

    const getCategoriaColor = (categoria: string) => {
        const colors = {
            tradicional: 'bg-santa-cruz-green text-white',
            moderno: 'bg-santa-cruz-blue text-white',
            infantil: 'bg-santa-cruz-red text-white',
            historico: 'bg-gray-600 text-white',
            leyenda: 'bg-purple-600 text-white',
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-santa-cruz-green mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando cuento...</p>
                </div>
            </div>
        )
    }

    if (error || !cuento) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">
                    {error || 'Cuento no encontrado'}
                </p>
                <Link href="/cuentos">
                    <Button>Volver a Cuentos</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/cuentos">
                    <Button variant="outline" className="flex items-center space-x-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver</span>
                    </Button>
                </Link>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleLike}
                        className={liked ? 'text-red-600 border-red-300 bg-red-50' : ''}
                    >
                        <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                        {cuento.likes}
                    </Button>
                    <Button variant="outline" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartir
                    </Button>
                    <Link href={`/cuento/${cuento.id}/editar`}>
                        <Button variant="outline">
                            <Pencil className="w-4 h-4 mr-2" /> Editar
                        </Button>
                    </Link>
                    <Button variant="outline" className="text-red-600 border-red-300"
                        onClick={async () => {
                            const ok = confirm('¿Eliminar este cuento? Esta acción no se puede deshacer.')
                            if (!ok) return
                            const { error } = await supabase.from('cuentos').delete().eq('id', cuento.id)
                            if (!error) router.push('/cuentos')
                        }}>
                        <Trash className="w-4 h-4 mr-2" /> Eliminar
                    </Button>
                </div>
            </div>

            {/* Imagen de portada */}
            {cuento.imagen_url && (
                <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden">
                    <Image
                        src={cuento.imagen_url}
                        alt={cuento.titulo}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Información del cuento */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                                {cuento.titulo}
                            </CardTitle>
                            <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>{cuento.autor}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(cuento.fecha_creacion)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{cuento.visualizaciones} visualizaciones</span>
                                </div>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoriaColor(cuento.categoria)}`}>
                            {getCategoriaLabel(cuento.categoria)}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Contenido del cuento */}
                    <div className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {cuento.contenido}
                        </div>
                    </div>

                    {/* Media controls */}
                    {(cuento.audio_url || cuento.video_url) && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Multimedia
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {cuento.audio_url && (
                                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                                        <Volume2 className="w-5 h-5 text-santa-cruz-green" />
                                        <audio controls className="flex-1">
                                            <source src={cuento.audio_url} type="audio/mpeg" />
                                            Tu navegador no soporta el elemento de audio.
                                        </audio>
                                    </div>
                                )}
                                {cuento.video_url && (
                                    <div className="w-full">
                                        <video controls className="w-full rounded-lg">
                                            <source src={cuento.video_url} type="video/mp4" />
                                            Tu navegador no soporta el elemento de video.
                                        </video>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Acciones adicionales */}
            <div className="flex justify-center space-x-4">
                <Link href="/cuentos">
                    <Button variant="outline">
                        Ver Más Cuentos
                    </Button>
                </Link>
                <Link href="/nuevo-cuento">
                    <Button className="bg-santa-cruz-green hover:bg-primary-600">
                        Compartir Mi Cuento
                    </Button>
                </Link>
            </div>
        </div>
    )
}
