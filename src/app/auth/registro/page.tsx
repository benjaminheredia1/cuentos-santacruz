'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RegistroPage() {
  const { signUp, user, loading, error } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signUp(email, password)
    if (!error) router.push('/auth/login')
  }

  if (user) {
    router.push('/cuentos')
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Crear Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-primaryGuarayo-500 hover:bg-primaryGuarayo-600">
              {loading ? 'Cargando...' : 'Registrarme'}
            </Button>
          </form>
          <p className="text-sm mt-4 text-center">¿Ya tienes cuenta? <Link href="/auth/login" className="text-primaryGuarayo-500 underline">Inicia sesión</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
