#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Cuentos Santa Cruz...\n');

// Crear archivo .env.local
const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://olscqocjamidtmpzxrxu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2Nxb2NqYW1pZHRtcHp4cnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MDY1NzUsImV4cCI6MjA3MzQ4MjU3NX0.tdnq2mjZtdqMw8bnYAlRdmvklNwTG6_CimRoUb0QWPQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2Nxb2NqYW1pZHRtcHp4cnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MDY1NzUsImV4cCI6MjA3MzQ4MjU3NX0.tdnq2mjZtdqMw8bnYAlRdmvklNwTG6_CimRoUb0QWPQ
`;

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado');
} else {
  console.log('⚠️  El archivo .env.local ya existe');
}

console.log('\n📋 Próximos pasos:');
console.log('1. Ejecuta el script SQL en tu proyecto de Supabase');
console.log('2. Instala las dependencias: npm install');
console.log('3. Ejecuta la aplicación: npm run dev');
console.log('\n🎉 ¡Configuración completada!');
console.log('\n📖 Lee SETUP.md para instrucciones detalladas');
