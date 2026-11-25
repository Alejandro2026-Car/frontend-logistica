// Panel principal: protege la página, muestra al usuario y comprueba los microservicios

(async function () {
    // 1. Debe existir un token
    if (!obtenerToken()) {
        window.location.replace('index.html');
        return;
    }

    // 2. El token debe seguir siendo válido en ms-auth
    const sesion = await llamarApi('auth', '/validar');
    if (!sesion.ok) {
        limpiarSesion();
        window.location.replace('index.html');
        return;
    }

    const usuario = sesion.data.usuario;
    document.getElementById('nombre-usuario').textContent = usuario.nombre;
    document.getElementById('rol-usuario').textContent = usuario.rol;
    document.getElementById('saludo').textContent = 'Hola, ' + usuario.nombre.split(' ')[0];
    document.body.classList.remove('cargando');

    // 3. Cerrar sesión
    document.getElementById('btn-salir').addEventListener('click', async () => {
        await llamarApi('auth', '/logout', { metodo: 'POST' });
        limpiarSesion();
        window.location.replace('index.html');
    });

    // 4. Estado de cada microservicio
    const modulos = [
        { clave: 'auth',        nombre: 'Autenticación', detalle: 'ms-auth · puerto 8001' },
        { clave: 'conductores', nombre: 'Conductores',   detalle: 'ms-conductores · puerto 8002' },
        { clave: 'vehiculos',   nombre: 'Vehículos',     detalle: 'ms-vehiculos · puerto 8003' },
        { clave: 'rutas',       nombre: 'Rutas y programación', detalle: 'ms-rutas · puerto 8004' },
        { clave: 'viajes',      nombre: 'Viajes y seguimiento', detalle: 'ms-viajes · puerto 8005' }
    ];

    const lista = document.getElementById('lista-servicios');
    lista.innerHTML = '';

    modulos.forEach(async (modulo) => {
        const fila = document.createElement('li');
        fila.className = 'servicio servicio--revisando';
        fila.innerHTML =
            '<span class="servicio__punto" aria-hidden="true"></span>' +
            '<span class="servicio__texto"><strong></strong><small></small></span>' +
            '<span class="servicio__estado">Revisando…</span>';
        fila.querySelector('strong').textContent = modulo.nombre;
        fila.querySelector('small').textContent = modulo.detalle;
        lista.appendChild(fila);

        const res = await llamarApi(modulo.clave, '/salud', { conToken: false });
        const estado = fila.querySelector('.servicio__estado');

        fila.classList.remove('servicio--revisando');
        if (res.ok) {
            fila.classList.add('servicio--ok');
            estado.textContent = 'En línea';
        } else if (res.status === 503) {
            fila.classList.add('servicio--alerta');
            estado.textContent = 'Sin base de datos';
        } else {
            fila.classList.add('servicio--caido');
            estado.textContent = 'Sin respuesta';
        }
    });
})();
