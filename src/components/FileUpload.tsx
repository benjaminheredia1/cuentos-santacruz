'use client'

import React, { useCallback, useState, useRef } from 'react'
import { Upload, X, File, Music, Video, Image } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
    onFileSelect: (file: File) => void
    onFileRemove: () => void
    selectedFile?: File | null
    accept: string
    maxSize?: number // en MB
    type: 'image' | 'audio' | 'video'
    className?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    onFileRemove,
    selectedFile,
    accept,
    maxSize = 10,
    type,
    className
}) => {
    const [isDragOver, setIsDragOver] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleFileSelect(files[0])
        }
    }, [])

    const handleFileSelect = (file: File) => {
        setError(null)

        // Validar tamaño
        if (file.size > maxSize * 1024 * 1024) {
            setError(`El archivo es demasiado grande. Máximo ${maxSize}MB`)
            return
        }

        // Validar tipo
        if (!file.type.match(accept.replace('*', '.*'))) {
            setError('Tipo de archivo no válido')
            return
        }

        onFileSelect(file)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    const getIcon = () => {
        if (selectedFile) {
            switch (type) {
                case 'image': return <Image className="w-8 h-8 text-primaryGuarayo-500" />
                case 'audio': return <Music className="w-8 h-8 text-primaryGuarayo-500" />
                case 'video': return <Video className="w-8 h-8 text-primaryGuarayo-500" />
                default: return <File className="w-8 h-8 text-primaryGuarayo-500" />
            }
        }
        return <Upload className="w-8 h-8 text-gray-400" />
    }

    const getTypeLabel = () => {
        switch (type) {
            case 'image': return 'imagen'
            case 'audio': return 'audio'
            case 'video': return 'video'
            default: return 'archivo'
        }
    }

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    isDragOver
                        ? "border-primaryGuarayo-500 bg-green-50"
                        : selectedFile
                            ? "border-primaryGuarayo-500 bg-green-50"
                            : "border-gray-300 hover:border-gray-400",
                    error && "border-red-500 bg-red-50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {selectedFile ? (
                    <div className="space-y-4">
                        {getIcon()}
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onFileRemove}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Eliminar
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {getIcon()}
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Arrastra tu {getTypeLabel()} aquí
                            </p>
                            <p className="text-xs text-gray-500">
                                o haz clic para seleccionar
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Máximo {maxSize}MB
                            </p>
                        </div>
                        <input
                            ref={inputRef}
                            type="file"
                            accept={accept}
                            onChange={handleInputChange}
                            className="hidden"
                            aria-label={`Seleccionar ${getTypeLabel()}`}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Seleccionar {getTypeLabel()}
                        </Button>
                    </div>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
            )}
        </div>
    )
}

export default FileUpload
