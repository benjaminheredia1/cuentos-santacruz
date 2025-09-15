'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Cuento } from '@/types'
import { supabase as supabaseClient } from '@/lib/supabase'

export const useCuentos = () => {
    const [cuentos, setCuentos] = useState<Cuento[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCuentos = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('cuentos')
                .select('*')
                .order('fecha_creacion', { ascending: false })

            if (error) throw error
            setCuentos(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar cuentos')
        } finally {
            setLoading(false)
        }
    }

    const createCuento = async (cuentoData: {
        titulo: string
        contenido: string
        autor: string
        categoria: string
        imagen_url?: string | null
        audio_url?: string | null
        video_url?: string | null
        user_id?: string | null
    }) => {
        try {
            const { data, error } = await supabase
                .from('cuentos')
                .insert([cuentoData])
                .select()
                .single()

            if (error) throw error

            setCuentos((prev: Cuento[]) => [data as Cuento, ...prev])
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear cuento')
            throw err
        }
    }

    const updateCuento = async (id: string, updates: Partial<Cuento>) => {
        try {
            const { data, error } = await supabase
                .from('cuentos')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            setCuentos((prev: Cuento[]) => prev.map((cuento: Cuento) =>
                cuento.id === id ? (data as Cuento) : cuento
            ))
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar cuento')
            throw err
        }
    }

    const deleteCuento = async (id: string) => {
        try {
            const { error } = await supabase
                .from('cuentos')
                .delete()
                .eq('id', id)

            if (error) throw error

            setCuentos((prev: Cuento[]) => prev.filter((cuento: Cuento) => cuento.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar cuento')
            throw err
        }
    }

    const likeCuento = async (id: string) => {
        try {
            const cuento = cuentos.find((c: Cuento) => c.id === id)
            if (!cuento) return

            const { data, error } = await supabase
                .from('cuentos')
                .update({ likes: cuento.likes + 1 })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            setCuentos((prev: Cuento[]) => prev.map((c: Cuento) =>
                c.id === id ? (data as Cuento) : c
            ))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al dar like')
            throw err
        }
    }

    const incrementViews = async (id: string) => {
        try {
            const cuento = cuentos.find((c: Cuento) => c.id === id)
            if (!cuento) return

            const { data, error } = await supabase
                .from('cuentos')
                .update({ visualizaciones: cuento.visualizaciones + 1 })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            setCuentos((prev: Cuento[]) => prev.map((c: Cuento) =>
                c.id === id ? (data as Cuento) : c
            ))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al incrementar visualizaciones')
            throw err
        }
    }

    useEffect(() => {
        fetchCuentos()
    }, [])

    return {
        cuentos,
        loading,
        error,
        fetchCuentos,
        createCuento,
        updateCuento,
        deleteCuento,
        likeCuento,
        incrementViews
    }
}
