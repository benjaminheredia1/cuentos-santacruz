import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Faltan variables de entorno Supabase. Crea un archivo .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (usa .env.example como guía) y reinicia el servidor.'
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
    public: {
        Tables: {
            cuentos: {
                Row: {
                    id: string
                    titulo: string
                    contenido: string
                    autor: string
                    fecha_creacion: string
                    categoria: string
                    imagen_url?: string
                    audio_url?: string
                    video_url?: string
                    likes: number
                    visualizaciones: number
                }
                Insert: {
                    id?: string
                    titulo: string
                    contenido: string
                    autor: string
                    fecha_creacion?: string
                    categoria: string
                    imagen_url?: string
                    audio_url?: string
                    video_url?: string
                    likes?: number
                    visualizaciones?: number
                }
                Update: {
                    id?: string
                    titulo?: string
                    contenido?: string
                    autor?: string
                    fecha_creacion?: string
                    categoria?: string
                    imagen_url?: string
                    audio_url?: string
                    video_url?: string
                    likes?: number
                    visualizaciones?: number
                }
            }
        }
    }
}
