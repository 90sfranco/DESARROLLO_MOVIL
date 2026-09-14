# Challenge 02 - PWA Agenda de Contactos

Aplicación React convertida en **PWA** (Progressive Web App): instalable, con manifiesto, Service Worker híbrido y funcionamiento offline.

## Enlace de despliegue

**Netlify:** https://6aa858b7c1df67c06b39bf4a--spontaneous-stardust-d0998b.netlify.app

## Cómo instalarla en el celular

1. Abre el enlace de Netlify en **Chrome** (Android) o **Safari** (iPhone).
2. Espera a que cargue la página completa (así se registra el Service Worker).
3. **Android (Chrome):** menú `⋮` -> **Instalar aplicación** / **Añadir a la pantalla de inicio**.
4. **iPhone (Safari):** botón **Compartir** -> **Añadir a pantalla de inicio**.
5. Confirma la instalación. El icono de la agenda quedará en la pantalla de inicio y la app se abrirá en modo independiente (sin barra del navegador).

## Cómo desplegar en Netlify (HTTPS)

El proyecto ya incluye `netlify.toml` (`npm run build` y carpeta `dist`).

1. Crea una cuenta en [Netlify](https://www.netlify.com/).
2. En el dashboard: **Add new site** -> **Import an existing project** (si el repo está en GitHub) **o** arrastra la carpeta `dist` después de ejecutar `npm run build`.
3. Si conectas GitHub:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Publica el sitio. Netlify asigna una URL `https://....netlify.app`.
5. Copia esa URL en la sección **Enlace de despliegue** de este README.

También puedes usar **Vercel** (`vercel.json` ya está configurado) o **GitHub Pages** con el contenido de `dist` y HTTPS activado.

## Uso local

```bash
npm install
npm run dev
```

Para probar la PWA como en producción (Service Worker activo):

```bash
npm run build
npm run preview
```

Abre la URL de preview en el navegador.
