export interface Cuento {
    id: string
    titulo: string
    contenido: string
    autor: string
    fecha_creacion: string
    categoria: string
    imagen_url?: string | null
    audio_url?: string | null
    video_url?: string | null
    user_id?: string | null
    likes: number
    visualizaciones: number
}

export interface CuentoFormData {
    titulo: string
    contenido: string
    autor: string
    categoria: string
    imagen?: File
    audio?: File
    video?: File
    user_id?: string
}

export type Categoria =
    | 'tradicional'
    | 'moderno'
    | 'infantil'
    | 'historico'
    | 'leyenda'
    | 'mito'
