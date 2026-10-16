# Gestor de Películas

Aplicación web para llevar una colección personal de películas. Está hecha en TypeScript con el patrón Modelo-Vista-Controlador y guarda los datos en el navegador.

## Funcionalidades

- Agregar películas con título, año, género, calificación (1 a 5 estrellas) y comentario.
- Editar una película y cancelar la edición.
- Eliminar una película, con confirmación.
- Marcar cada película como vista o pendiente.
- Buscar por título o género.
- Filtrar por género, año y estado (vistas o pendientes).
- Ordenar por título, año o calificación.
- Ver estadísticas: total, vistas, pendientes y promedio de calificación.
- Ver recomendaciones (películas con 4 o 5 estrellas) y un top 5.
- Validar título, año (1888–2100), género, calificación y títulos repetidos.
- Conservar la colección en `localStorage` al recargar la página.

## Cómo ejecutarlo

```bash
npm install
npm run build
```

Abre `index.html` en el navegador. Para recompilar al editar el código:

```bash
npm run dev
```
