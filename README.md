# Cuentos de Guarayo · Voces Ancestrales

Plataforma web para preservar, compartir y difundir relatos, memorias orales y expresiones culturales del pueblo Guarayo. Construida con Next.js 14, Supabase y Tailwind CSS.

## 🎨 Características

- **Identidad Cultural**: Paleta inspirada en la selva, la tierra y los tonos artesanales guarayo
- **Subida de Archivos**: Soporte para imágenes, audios y videos
- **Categorización**: Cuentos organizados por categorías (tradicional, moderno, infantil, etc.)
- **Búsqueda Avanzada**: Filtros por categoría, autor, contenido y más
- **Interactividad**: Sistema de likes y visualizaciones
- **Responsive**: Diseño adaptativo para todos los dispositivos

## 🚀 Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **UI Components**: Componentes personalizados con Lucide React

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd cuentos-santa-cruz
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   ```

4. **Configurar Supabase**
   - Crear un nuevo proyecto en [Supabase](https://supabase.com)
   - Ejecutar el script SQL en `database/schema.sql` en el SQL Editor
   - Configurar las políticas de RLS según sea necesario

5. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

## 🗄️ Base de Datos

### Tabla `cuentos`
- `id`: UUID (clave primaria)
- `titulo`: Título del cuento
- `contenido`: Contenido completo del cuento
- `autor`: Nombre del autor
- `fecha_creacion`: Fecha de creación
- `categoria`: Categoría del cuento
- `imagen_url`: URL de la imagen de portada
- `audio_url`: URL del archivo de audio
- `video_url`: URL del archivo de video
- `likes`: Número de likes
- `visualizaciones`: Número de visualizaciones

### Storage
- Bucket `cuentos-media` para archivos multimedia
- Políticas configuradas para acceso público

## 🎨 Paleta de Colores (Nueva Identidad)

Basada en elementos naturales y simbología Guarayo:
- **Forest (Bosque)**: `#1B5E20` (Primario / vida y territorio)
- **Accent (Artesanal / Sol)**: `#C47F1D`
- **Earth (Tierra / Raíz)**: `#6B4F3A`
- **River (Agua / Camino)**: `#0E4D64`
- **Light (Luz / Fondo)**: `#F5F1E6`

## 📱 Páginas

- **Inicio** (`/`): Página principal con cuentos destacados
- **Cuentos** (`/cuentos`): Lista completa de cuentos con filtros
- **Nuevo Cuento** (`/nuevo-cuento`): Formulario para crear cuentos
- **Detalle** (`/cuento/[id]`): Vista detallada de un cuento
- **Buscar** (`/buscar`): Búsqueda avanzada con filtros

## 🔧 Scripts Disponibles

- `npm run dev`: Ejecutar en modo desarrollo
- `npm run build`: Construir para producción
- `npm run start`: Ejecutar en modo producción
- `npm run lint`: Ejecutar linter

## 📝 Funcionalidades

### Para Usuarios
- Ver cuentos destacados y populares
- Buscar cuentos por título, autor o contenido
- Filtrar por categoría
- Leer cuentos completos
- Escuchar audios y ver videos
- Dar likes a cuentos favoritos
- Compartir cuentos

### Para Creadores
- Crear nuevos cuentos
- Subir imágenes de portada
- Agregar audios narrados
- Incluir videos
- Categorizar cuentos
- Ver estadísticas de interacción

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Otras plataformas
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Comunidad de Santa Cruz de la Sierra por preservar estas tradiciones
- Supabase por la excelente plataforma de backend
- Next.js team por el framework increíble
- Tailwind CSS por el sistema de diseño

---

**¡Honremos y preservemos las voces ancestrales Guarayo!** �
