# frontend-logistica

Frontend de **LogiTrans Express** con HTML5, CSS3 y JavaScript Vanilla (sin frameworks).

## Ejecutar

Abrir la carpeta con VS Code y usar **Live Server** (clic derecho en `index.html` → *Open with Live Server*),
o bien:

```bash
php -S localhost:5500
```

Las direcciones de los microservicios se configuran en `js/config.js`.

## Estructura

```
index.html        Inicio de sesión
dashboard.html    Panel con el estado de los 5 microservicios
css/styles.css    Estilos
js/config.js      URLs de los servicios y claves de sesión
js/api.js         Cliente fetch + manejo del token
js/auth.js        Lógica del login
js/dashboard.js   Protección de la página, logout y estado de servicios
```

## Avance

- [x] Login y cierre de sesión contra ms-auth
- [x] Token guardado en localStorage y validado al entrar al panel
- [ ] Conductores · Vehículos · Rutas · Programación · Viajes
