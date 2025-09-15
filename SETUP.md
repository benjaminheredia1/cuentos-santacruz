# Configuración del Proyecto Cuentos Santa Cruz

## 🔧 Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://olscqocjamidtmpzxrxu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2Nxb2NqYW1pZHRtcHp4cnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MDY1NzUsImV4cCI6MjA3MzQ4MjU3NX0.tdnq2mjZtdqMw8bnYAlRdmvklNwTG6_CimRoUb0QWPQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2Nxb2NqYW1pZHRtcHp4cnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MDY1NzUsImV4cCI6MjA3MzQ4MjU3NX0.tdnq2mjZtdqMw8bnYAlRdmvklNwTG6_CimRoUb0QWPQ
```

## 🗄️ Configuración de Supabase

### 1. Ejecutar el Script SQL

Ve a tu proyecto de Supabase → SQL Editor y ejecuta el siguiente script:

```sql
-- Crear tabla de cuentos
CREATE TABLE cuentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  autor VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('tradicional', 'moderno', 'infantil', 'historico', 'leyenda', 'mito')),
  imagen_url TEXT,
  audio_url TEXT,
  video_url TEXT,
  likes INTEGER DEFAULT 0,
  visualizaciones INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_cuentos_categoria ON cuentos(categoria);
CREATE INDEX idx_cuentos_fecha ON cuentos(fecha_creacion DESC);
CREATE INDEX idx_cuentos_likes ON cuentos(likes DESC);

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para updated_at
CREATE TRIGGER update_cuentos_updated_at 
    BEFORE UPDATE ON cuentos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE cuentos ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Permitir lectura pública de cuentos" ON cuentos
    FOR SELECT USING (true);

-- Política para permitir inserción (puedes ajustar según tus necesidades de autenticación)
CREATE POLICY "Permitir inserción de cuentos" ON cuentos
    FOR INSERT WITH CHECK (true);

-- Política para permitir actualización
CREATE POLICY "Permitir actualización de cuentos" ON cuentos
    FOR UPDATE USING (true);

-- Crear bucket para archivos multimedia
INSERT INTO storage.buckets (id, name, public) VALUES ('cuentos-media', 'cuentos-media', true);

-- Política para permitir subida de archivos
CREATE POLICY "Permitir subida de archivos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'cuentos-media');

-- Política para permitir lectura de archivos
CREATE POLICY "Permitir lectura de archivos" ON storage.objects
    FOR SELECT USING (bucket_id = 'cuentos-media');

-- Política para permitir eliminación de archivos
CREATE POLICY "Permitir eliminación de archivos" ON storage.objects
    FOR DELETE USING (bucket_id = 'cuentos-media');
```

### 2. Verificar la Configuración

1. Ve a **Authentication** → **Settings** y asegúrate de que la autenticación esté habilitada
2. Ve a **Storage** → **Buckets** y verifica que el bucket `cuentos-media` esté creado
3. Ve a **Database** → **Tables** y verifica que la tabla `cuentos` esté creada

## 🚀 Ejecutar la Aplicación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## ✅ Verificar que Todo Funciona

1. **Página de inicio** - Debe cargar sin errores
2. **Crear cuento** - Ve a `/nuevo-cuento` y prueba crear un cuento
3. **Subir archivos** - Prueba subir una imagen, audio o video
4. **Ver cuentos** - Ve a `/cuentos` para ver la lista
5. **Buscar** - Ve a `/buscar` para probar la búsqueda

## 🔧 Solución de Problemas

### Error de conexión a Supabase
- Verifica que las URLs y claves en `.env.local` sean correctas
- Asegúrate de que el proyecto de Supabase esté activo

### Error de permisos en Storage
- Verifica que las políticas de RLS estén configuradas correctamente
- Asegúrate de que el bucket `cuentos-media` sea público

### Error al crear cuentos
- Verifica que la tabla `cuentos` esté creada correctamente
- Revisa los logs de Supabase para errores específicos

## 📱 Funcionalidades Disponibles

- ✅ Crear cuentos con texto, imagen, audio y video
- ✅ Ver lista de cuentos con filtros
- ✅ Búsqueda avanzada
- ✅ Sistema de likes y visualizaciones
- ✅ Categorización de cuentos
- ✅ Diseño responsive
- ✅ Paleta de colores de Santa Cruz

¡Tu aplicación está lista para preservar la tradición oral cruceña! 🇧🇴
