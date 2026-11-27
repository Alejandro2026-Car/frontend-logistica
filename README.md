# frontend-logistica

Frontend de **LogiTrans Express** con HTML5, CSS3 y JavaScript Vanilla (módulos ES, sin frameworks), organizado en **MVC**.

## Ejecutar

Abrir la carpeta con VS Code y usar **Live Server** (clic derecho en `index.html` → *Open with Live Server*),
o bien `php -S localhost:5500` dentro de esta carpeta.
Los módulos ES **no funcionan abriendo el archivo con doble clic** (`file://`); hay que servirlo por HTTP.

Las direcciones de los microservicios se configuran en `js/config.js`.

## Arquitectura MVC

```
*.html                  Estructura de cada pantalla
css/styles.css          Estilos
js/
├── config.js           URLs de los servicios
├── services/           Acceso a fetch y al localStorage (ApiService, AlmacenSesion)
├── models/             MODELO: datos, validaciones y llamadas a la API
│   ├── SesionModel.js · ServicioModel.js · ConductorModel.js · VehiculoModel.js
├── views/              VISTA: pintar y leer el DOM (nada de fetch aquí)
│   ├── BarraView.js · LoginView.js · DashboardView.js · ConductoresView.js · VehiculosView.js
└── controllers/        CONTROLADOR: conecta eventos → modelo → vista
    ├── LoginController.js · DashboardController.js · ConductoresController.js · VehiculosController.js · SesionGuard.js
```

Flujo: el usuario actúa en la **vista** → el **controlador** captura el evento → pide datos al **modelo** →
el modelo consulta al microservicio → el controlador entrega el resultado a la **vista** para mostrarlo.

## Avance

- [x] Login y cierre de sesión contra ms-auth
- [x] Panel con el estado de los 5 microservicios
- [x] Conductores: listar, buscar, crear, editar, cambiar estado y eliminar
- [x] Vehículos: listar, buscar, crear, editar, cambiar estado y eliminar
- [ ] Rutas · Programación · Viajes
