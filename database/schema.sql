-- Extensiones necesarias (idempotente)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear tabla de cuentos si no existe
CREATE TABLE IF NOT EXISTS public.cuentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('tradicional', 'moderno', 'infantil', 'historico', 'leyenda', 'mito')),
    imagen_url TEXT,
    audio_url TEXT,
    video_url TEXT,
    user_id UUID,
    likes INTEGER DEFAULT 0,
    visualizaciones INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asegurar columna user_id existe (para instalaciones previas sin la columna)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'cuentos' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.cuentos ADD COLUMN user_id UUID;
    END IF;
END $$;

-- Crear índices para mejor rendimiento
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_cuentos_categoria ON public.cuentos(categoria);
    CREATE INDEX IF NOT EXISTS idx_cuentos_fecha ON public.cuentos(fecha_creacion DESC);
    CREATE INDEX IF NOT EXISTS idx_cuentos_likes ON public.cuentos(likes DESC);
END $$;

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para updated_at
DO $$ BEGIN
    IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'update_cuentos_updated_at'
    ) THEN
        CREATE TRIGGER update_cuentos_updated_at 
            BEFORE UPDATE ON public.cuentos 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.cuentos ENABLE ROW LEVEL SECURITY;

-- Añadir constraint FK a auth.users si aún no existe (no bloqueante si ya está)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage WHERE table_name='cuentos' AND constraint_name='cuentos_user_id_fkey'
    ) THEN
        ALTER TABLE public.cuentos
            ADD CONSTRAINT cuentos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Política para permitir lectura pública
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Permitir lectura pública de cuentos'
    ) THEN
        CREATE POLICY "Permitir lectura pública de cuentos" ON public.cuentos
                FOR SELECT USING (true);
    END IF;
END $$;

-- Política para permitir inserción (puedes ajustar según tus necesidades de autenticación)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Permitir inserción de cuentos'
    ) THEN
    CREATE POLICY "Permitir inserción de cuentos" ON public.cuentos
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
    END IF;
END $$;

-- Política para permitir actualización
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Permitir actualización de cuentos'
    ) THEN
        -- Versión abierta (cualquiera puede actualizar) ajustar según necesidad
        CREATE POLICY "Permitir actualización de cuentos" ON public.cuentos
                FOR UPDATE USING (true);
    END IF;
END $$;

-- Policy para borrado sólo owner
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Permitir eliminación de cuentos'
    ) THEN
            -- Versión abierta (cualquiera puede eliminar)
            CREATE POLICY "Permitir eliminación de cuentos" ON public.cuentos
                FOR DELETE USING (true);
    END IF;
END $$;

-- Crear bucket para archivos multimedia
INSERT INTO storage.buckets (id, name, public)
SELECT 'cuentos-media', 'cuentos-media', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'cuentos-media'
);

-- Política para permitir subida de archivos
DO $$ BEGIN
    IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Permitir subida de archivos'
    ) THEN
        CREATE POLICY "Permitir subida de archivos" ON storage.objects
                FOR INSERT WITH CHECK (bucket_id = 'cuentos-media');
    END IF;
END $$;

-- Política para permitir lectura de archivos
DO $$ BEGIN
    IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Permitir lectura de archivos'
    ) THEN
        CREATE POLICY "Permitir lectura de archivos" ON storage.objects
                FOR SELECT USING (bucket_id = 'cuentos-media');
    END IF;
END $$;

-- Política para permitir eliminación de archivos
DO $$ BEGIN
    IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Permitir eliminación de archivos'
    ) THEN
        CREATE POLICY "Permitir eliminación de archivos" ON storage.objects
                FOR DELETE USING (bucket_id = 'cuentos-media');
    END IF;
END $$;
