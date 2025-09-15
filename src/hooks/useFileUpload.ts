'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export const useFileUpload = () => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const uploadFile = async (file: File, bucket: string = 'cuentos-media', directory?: string): Promise<string | null> => {
        try {
            setUploading(true)
            setError(null)

            // Generar nombre único para el archivo
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = directory ? `${directory}/${fileName}` : `${fileName}`

            // Subir archivo a Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) {
                throw new Error(`Error al subir archivo: ${uploadError.message}`)
            }

            // Obtener URL pública del archivo
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            return publicUrl
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al subir archivo'
            setError(errorMessage)
            console.error('Error uploading file:', err)
            return null
        } finally {
            setUploading(false)
        }
    }

    const deleteFile = async (filePath: string, bucket: string = 'cuentos-media'): Promise<boolean> => {
        try {
            setError(null)

            const { error } = await supabase.storage
                .from(bucket)
                .remove([filePath])

            if (error) {
                throw new Error(`Error al eliminar archivo: ${error.message}`)
            }

            return true
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar archivo'
            setError(errorMessage)
            console.error('Error deleting file:', err)
            return false
        }
    }

    const uploadMultipleFiles = async (files: File[], bucket: string = 'cuentos-media', directory?: string): Promise<string[]> => {
        const uploadPromises = files.map(file => uploadFile(file, bucket, directory))
        const results = await Promise.all(uploadPromises)
        return results.filter((url): url is string => url !== null)
    }

    return {
        uploadFile,
        deleteFile,
        uploadMultipleFiles,
        uploading,
        error
    }
}
