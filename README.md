# Educación Cultural Olavarría

Aplicación web para organizar escuelas artísticas, talleres, docentes, horarios y documentos. Incluye un mapa interactivo y administración protegida con Supabase.

## 1 Abrir en Visual Studio Code

1. Descomprimí el ZIP.
2. En Visual Studio Code elegí **Archivo > Abrir carpeta**.
3. Abrí la terminal integrada y ejecutá:

```powershell
corepack enable
pnpm install
```

## 2 Preparar Supabase

1. Abrí tu proyecto de Supabase.
2. Entrá en **SQL Editor**.
3. Copiá y ejecutá todo el archivo `supabase/setup.sql`.
4. Entrá en **Authentication > Users** y creá el usuario administrador con correo municipal.
5. En el panel **Connect** copiá la URL del proyecto y la clave **Publishable**.
6. Copiá `.env.example`, renombralo `.env.local` y completá:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICABLE
```

La lectura del mapa es pública. La base sólo permite crear, editar o eliminar a usuarios autenticados con correo `@olavarria.gov.ar`. La clave `service_role` no debe colocarse en este proyecto.

Si vas a usar otro dominio de correo, reemplazá `@olavarria.gov.ar` en las tres políticas del archivo `supabase/setup.sql` antes de ejecutarlo.

## 3 Probar localmente

```powershell
pnpm dev
```

Abrí `http://localhost:3000`.

Para comprobar la versión de producción:

```powershell
pnpm lint
pnpm build
```

## 4 Subir a GitHub

Creá un repositorio vacío en GitHub. Después ejecutá en la terminal:

```powershell
git init
git add .
git commit -m "Primera versión Educación Cultural"
git branch -M main
git remote add origin URL-DE-TU-REPOSITORIO
git push -u origin main
```

## 5 Publicar en Vercel

1. En Vercel elegí **Add New > Project**.
2. Importá el repositorio de GitHub.
3. En **Environment Variables** agregá `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Presioná **Deploy**.

Cada cambio enviado a la rama `main` generará un nuevo despliegue.

## Uso

- **Nueva escuela**: solicita ingresar si no hay sesión iniciada.
- **Ubicar**: consulta la dirección y completa las coordenadas.
- **Guardar escuela**: agrega inmediatamente la ficha y el marcador.
- **Editar y eliminar**: aparecen en la ficha cuando el usuario está autenticado.
