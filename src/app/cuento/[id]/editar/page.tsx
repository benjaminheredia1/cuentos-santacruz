'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Cuento } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import FileUpload from '@/components/FileUpload'
import { uploadMedia } from '@/lib/mediaUpload'

export default function EditarCuentoPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const cuentoId = params.id as string
  const [cuento, setCuento] = useState<Cuento | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  const categorias = ['tradicional','moderno','infantil','historico','leyenda','mito']

  useEffect(() => { fetchCuento() }, [cuentoId])

  const fetchCuento = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('cuentos').select('*').eq('id', cuentoId).single()
    if (error) setError(error.message)
    setCuento(data)
    setLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cuento) return
    if (!user) {
      setError('Debes iniciar sesión')
      return
    }
    setSaving(true)
    setError(null)
    try {
      let imagen_url = cuento.imagen_url
      let audio_url = cuento.audio_url
      let video_url = cuento.video_url
      if (imagenFile) imagen_url = await uploadMedia(imagenFile, 'image')
      if (audioFile) audio_url = await uploadMedia(audioFile, 'audio')
      if (videoFile) video_url = await uploadMedia(videoFile, 'video')

      const { error } = await supabase.from('cuentos').update({
        titulo: cuento.titulo,
        contenido: cuento.contenido,
        autor: cuento.autor,
        categoria: cuento.categoria,
        imagen_url,
        audio_url,
        video_url
      }).eq('id', cuentoId)
      if (error) throw error
      router.push(`/cuento/${cuentoId}`)
    } catch (err:any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className='p-8'>Cargando...</p>
  if (error) return <p className='p-8 text-red-600'>Error: {error}</p>
  if (!cuento) return <p className='p-8'>No encontrado</p>
  if (user && cuento.user_id && cuento.user_id !== user.id) return <p className='p-8 text-red-600'>No tienes permisos para editar este cuento.</p>

  return (
    <div className='max-w-3xl mx-auto space-y-8'>
      <h1 className='text-2xl font-bold'>Editar Cuento</h1>
      <form onSubmit={handleUpdate} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Título</label>
              <Input value={cuento.titulo} onChange={e => setCuento(c => c ? { ...c, titulo: e.target.value } : c)} required />
            </div>
            <div>
              <label className='text-sm font-medium'>Autor</label>
              <Input value={cuento.autor} onChange={e => setCuento(c => c ? { ...c, autor: e.target.value } : c)} required />
            </div>
            <div>
              <label className='text-sm font-medium'>Categoría</label>
              <Select value={cuento.categoria} onChange={e => setCuento(c => c ? { ...c, categoria: e.target.value } : c)}>
                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>Contenido</label>
              <Textarea rows={10} value={cuento.contenido} onChange={e => setCuento(c => c ? { ...c, contenido: e.target.value } : c)} required />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Multimedia</CardTitle></CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <p className='text-sm mb-2'>Imagen</p>
              <FileUpload type='image' accept='image/*' selectedFile={imagenFile} onFileSelect={f => setImagenFile(f)} onFileRemove={() => setImagenFile(null)} maxSize={5} />
            </div>
            <div>
              <p className='text-sm mb-2'>Audio</p>
              <FileUpload type='audio' accept='audio/*' selectedFile={audioFile} onFileSelect={f => setAudioFile(f)} onFileRemove={() => setAudioFile(null)} maxSize={50} />
            </div>
            <div>
              <p className='text-sm mb-2'>Video</p>
              <FileUpload type='video' accept='video/*' selectedFile={videoFile} onFileSelect={f => setVideoFile(f)} onFileRemove={() => setVideoFile(null)} maxSize={100} />
            </div>
          </CardContent>
        </Card>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
        <div className='flex justify-end space-x-4'>
          <Button type='button' variant='outline' onClick={() => router.back()}>Cancelar</Button>
          <Button type='submit' disabled={saving} className='bg-santa-cruz-green'>{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
        </div>
      </form>
    </div>
  )
}
