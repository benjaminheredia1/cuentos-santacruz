import { supabase } from '@/lib/supabase'

export type MediaType = 'image' | 'audio' | 'video'

const typeDirectoryMap: Record<MediaType, string> = {
    image: 'images',
    audio: 'audios',
    video: 'videos'
}

/**
 * Sube un archivo multimedia al bucket indicado organizándolo por subcarpetas según el tipo.
 * Retorna la URL pública o lanza un error.
 */
export async function uploadMedia(file: File, type: MediaType, bucket: string = 'cuentos-media'): Promise<string> {
    const directory = typeDirectoryMap[type]
    const fileExt = file.name.split('.').pop()
    const safeExt = fileExt?.toLowerCase() || 'bin'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`
    const path = `${directory}/${fileName}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false
    })
    if (uploadError) {
        throw new Error(`Error al subir ${type}: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    return publicUrl
}
