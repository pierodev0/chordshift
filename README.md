# ChordShift — Songbook

Aplicación mobile-first para guitarristas que aprenden canciones. Guardá canciones con acordes, transponé, creá listas de práctica, filtrá por secciones y practicá con audio MP3 sincronizado.

## Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Pinia** — estado global
- **Vue Router** — SPA routing
- **Tailwind CSS v4** — estilos utilitarios
- **Vite** — build tool
- **localStorage** — persistencia de datos
- **IndexedDB** — almacenamiento de audio MP3

## Características

### Canciones
- CRUD completo de canciones con título, artista, contenido (letra + acordes), cejilla (capo) y archivo MP3
- Resaltado automático de acordes en el contenido
- Transposición con bottom sheet (subir/bajar tonos cromáticamente)
- Filtro de secciones: parsea `[Verse]`, `[Chorus]`, etc. y permite ocultar/mostrar secciones
- Visualización de cejilla formateada ("Capo 1", "Capo 2", etc.)
- ChordLegend: lista de acordes detectados en la canción

### Listas de práctica
- CRUD completo de listas
- Agregar/quitar canciones de una lista con selector checkbox
- Conteo de canciones por lista
- Modo edición para remover canciones individuales

### Audio
- Subida de archivos MP3 desde el editor de canciones
- Almacenamiento en IndexedDB con caché persistente
- Reproductor con play/pause, barra de progreso y tiempo transcurrido
- Autoscroll sincronizado con la reproducción (línea por línea)
- Limpieza automática del audio al eliminar una canción

### Interfaz
- Mobile-first responsive design
- Tema Plume inspirado en guitarra (paleta naranja OKLCH)
- Tipografía: Sora (sans) + JetBrains Mono (mono)
- Tab bar de navegación (Canciones | Listas)
- Búsqueda en tiempo real en canciones y listas
- Animaciones staggered en listas, hover-lift en cards
- Componentes UI reutilizables: AppButton, AppIconButton, AppInput, AppPageHeader
- Empty states con CTA

### Persistencia
- Arquitectura de adaptadores (localStorageAdapter) preparada para migrar a Supabase
- Los datos sobreviven al cierre del navegador

## Rutas

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | SongList | Listado de canciones con búsqueda |
| `/song/new` | SongEditor | Crear nueva canción |
| `/song/:id` | SongDetail | Ver canción con acordes, audio y secciones |
| `/song/:id/edit` | SongEditor | Editar canción |
| `/playlists` | PlaylistList | Listado de listas con búsqueda |
| `/playlists/new` | PlaylistEditor | Crear nueva lista |
| `/playlists/:id` | PlaylistDetail | Ver lista con sus canciones |
| `/playlists/:id/edit` | PlaylistEditor | Editar lista |

## Desarrollo

```bash
pnpm dev     # Servidor de desarrollo
pnpm build   # Build de producción
pnpm preview # Preview del build
```

## Lo que falta para ser un songbook profesional

### Práctica
- [ ] Velocidad de autoscroll ajustable (lento/rápido)
- [ ] Metrónomo integrado (BPM configurable)
- [ ] Loop de secciones (repetir un verso o coro N veces)
- [ ] Historial de práctica (última vez que se practicó cada canción)

### Audio
- [ ] Grabación de voz/guitarra desde la app
- [ ] Control de velocidad de reproducción (0.5x, 0.75x, 1.0x, 1.5x)
- [ ] Ecualizador básico o resalte de frecuencias de guitarra
- [ ] Crossfade entre loops

### Edición
- [ ] Editor WYSIWYG con preview en vivo
- [ ] Sugerencia automática de acordes (dada una progresión, sugerir los siguientes)
- [ ] Diagramas de acordes (trastes) para cada acorde detectado
- [ ] Importar canciones desde Ultimate Guitar / Cifra Club
- [ ] Soporte para tabs (tablatura) además de acordes

### Sincronización
- [ ] Cuenta de usuario con autenticación
- [ ] Sincronización cross-device (Supabase / Firestore)
- [ ] Modo offline con sincronización diferida
- [ ] Compartir canciones/playlists por link

### Experiencia
- [ ] Modo oscuro
- [ ] Ajuste de tamaño de letra (accesibilidad)
- [ ] Swipe para eliminar en listas
- [x] Drag & drop para reordenar canciones en listas
- [ ] Atajos de teclado (espacio para play/pause)
- [ ] PWA instalable con service worker
- [ ] Exportar/importar datos completos (JSON)
- [ ] Widget de acorde actual (si suena un acorde, mostrar cómo se pone)
- [ ] Reconocimiento de acordes por micrófono
