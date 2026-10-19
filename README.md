# Gestor de Películas

Aplicación web para llevar una colección personal de películas.

## Funcionalidades

- Registrar directores y películas relacionadas: cada película pertenece a un director.
- Agregar, editar y eliminar directores y películas. Un director con películas no se puede eliminar.
- Marcar cada película como vista o pendiente.
- Buscar por título, género o director.
- Filtrar por género, año y estado (vistas o pendientes).
- Ordenar por título, año o calificación.
- Cambiar entre las pestañas Películas, Directores y Resumen.
- Ver estadísticas: total, vistas, pendientes, promedio y cantidad de directores.
- Ver recomendaciones (películas con 4 o 5 estrellas) y un top 5.
- Validar título, año (1888–2100), género, director, calificación, títulos repetidos, el formato del nombre y el correo del director.
- Avisar el resultado con una notificación que se cierra sola.
- Conservar películas y directores en `localStorage` al recargar la página.

## Cómo ejecutarlo

```bash
npm install
npm run build
```

Abre `index.html` en el navegador. Para recompilar al editar el código:

```bash
npm run dev
```
