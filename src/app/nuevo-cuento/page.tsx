'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCuentos } from '@/hooks/useCuentos'
import { useFileUpload } from '@/hooks/useFileUpload'
import { uploadMedia } from '@/lib/mediaUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FileUpload from '@/components/FileUpload'
import { Upload, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CuentoFormData, Categoria } from '@/types'
import { useAuth } from '@/hooks/useAuth'

export default function NuevoCuentoPage() {
    const router = useRouter()
    const { createCuento } = useCuentos()
    const { uploadFile, uploading } = useFileUpload()
    const { user } = useAuth()

    const [formData, setFormData] = useState<CuentoFormData>({
        titulo: '',
        contenido: '',
        autor: '',
        categoria: 'tradicional'
    })

    const [files, setFiles] = useState<{
        imagen?: File | null
        audio?: File | null
        video?: File | null
    }>({})

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const categorias: { value: Categoria; label: string }[] = [
        { value: 'tradicional', label: 'Tradicional' },
        { value: 'moderno', label: 'Moderno' },
        { value: 'infantil', label: 'Infantil' },
        { value: 'historico', label: 'Histórico' },
        { value: 'leyenda', label: 'Leyenda' },
        { value: 'mito', label: 'Mito' }
    ]

    const handleInputChange = (field: keyof CuentoFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleFileSelect = (type: 'imagen' | 'audio' | 'video', file: File) => {
        setFiles(prev => ({ ...prev, [type]: file }))
    }

    const handleFileRemove = (type: 'imagen' | 'audio' | 'video') => {
        setFiles(prev => ({ ...prev, [type]: null }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            if (!user) {
                throw new Error('Debes iniciar sesión para publicar un cuento')
            }
            // Validar campos requeridos
            if (!formData.titulo.trim() || !formData.contenido.trim() || !formData.autor.trim()) {
                throw new Error('Todos los campos son obligatorios')
            }

            // Subir archivos si existen
            let imagenUrl: string | null = null
            let audioUrl: string | null = null
            let videoUrl: string | null = null

            if (files.imagen) {
                imagenUrl = await uploadMedia(files.imagen, 'image')
            }
            if (files.audio) {
                audioUrl = await uploadMedia(files.audio, 'audio')
            }
            if (files.video) {
                videoUrl = await uploadMedia(files.video, 'video')
            }

            // Crear cuento
            const cuentoData = {
                titulo: formData.titulo.trim(),
                contenido: formData.contenido.trim(),
                autor: formData.autor.trim(),
                categoria: formData.categoria,
                imagen_url: imagenUrl || null,
                audio_url: audioUrl || null,
                video_url: videoUrl || null,
                user_id: user.id
            }

            await createCuento(cuentoData)

            // Redirigir a la página de cuentos
            router.push('/cuentos')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el cuento')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Nuevo Cuento</h1>
                    <p className="text-gray-600 mt-2">
                        Comparte un relato ancestral del pueblo Guarayo
                    </p>
                </div>
                <Link href="/cuentos">
                    <Button variant="outline" className="flex items-center space-x-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver</span>
                    </Button>
                </Link>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información básica */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Upload className="w-5 h-5 text-primaryGuarayo-500" />
                            <span>Información del Cuento</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título *
                                </label>
                                <Input
                                    value={formData.titulo}
                                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                                    placeholder="Ej: El Cuento del Tigre"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Autor *
                                </label>
                                <Input
                                    value={formData.autor}
                                    onChange={(e) => handleInputChange('autor', e.target.value)}
                                    placeholder="Tu nombre o el autor original"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría *
                            </label>
                            <Select
                                value={formData.categoria}
                                onChange={(e) => handleInputChange('categoria', e.target.value as Categoria)}
                                required
                            >
                                {categorias.map(categoria => (
                                    <option key={categoria.value} value={categoria.value}>
                                        {categoria.label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contenido del Cuento *
                            </label>
                            <Textarea
                                value={formData.contenido}
                                onChange={(e) => handleInputChange('contenido', e.target.value)}
                                placeholder="Escribe aquí el cuento completo..."
                                rows={12}
                                required
                                className="resize-none"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                {formData.contenido.length} caracteres
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Archivos multimedia */}
                <Card>
                    <CardHeader>
                        <CardTitle>Archivos Multimedia (Opcional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Imagen */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen de Portada
                                </label>
                                <FileUpload
                                    type="image"
                                    accept="image/*"
                                    maxSize={5}
                                    selectedFile={files.imagen}
                                    onFileSelect={(file) => handleFileSelect('imagen', file)}
                                    onFileRemove={() => handleFileRemove('imagen')}
                                />
                            </div>

                            {/* Audio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Audio del Cuento
                                </label>
                                <FileUpload
                                    type="audio"
                                    accept="audio/*"
                                    maxSize={50}
                                    selectedFile={files.audio}
                                    onFileSelect={(file) => handleFileSelect('audio', file)}
                                    onFileRemove={() => handleFileRemove('audio')}
                                />
                            </div>

                            {/* Video */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video del Cuento
                                </label>
                                <FileUpload
                                    type="video"
                                    accept="video/*"
                                    maxSize={100}
                                    selectedFile={files.video}
                                    onFileSelect={(file) => handleFileSelect('video', file)}
                                    onFileRemove={() => handleFileRemove('video')}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-end space-x-4">
                    <Link href="/cuentos">
                        <Button variant="outline" type="button">
                            Cancelar
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={saving || uploading}
                        className="bg-primaryGuarayo-500 hover:bg-primaryGuarayo-600"
                    >
                        {saving || uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {uploading ? 'Subiendo archivos...' : 'Guardando...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Publicar Cuento
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
