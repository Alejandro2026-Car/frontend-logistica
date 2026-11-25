// Utilidades de sesión y cliente HTTP para consumir los microservicios

function obtenerToken() {
    return localStorage.getItem(CONFIG.CLAVE_TOKEN);
}

function obtenerUsuario() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.CLAVE_USUARIO));
    } catch (e) {
        return null;
    }
}

function guardarSesion(token, usuario) {
    localStorage.setItem(CONFIG.CLAVE_TOKEN, token);
    localStorage.setItem(CONFIG.CLAVE_USUARIO, JSON.stringify(usuario));
}

function limpiarSesion() {
    localStorage.removeItem(CONFIG.CLAVE_TOKEN);
    localStorage.removeItem(CONFIG.CLAVE_USUARIO);
}

/**
 * Llama a un microservicio.
 * @param {string} servicio  clave de CONFIG.SERVICIOS (auth, conductores, ...)
 * @param {string} ruta      por ejemplo '/login'
 * @param {object} opciones  { metodo, cuerpo, conToken }
 * @returns {Promise<{ok:boolean,status:number,mensaje:string,data:any}>}
 */
async function llamarApi(servicio, ruta, { metodo = 'GET', cuerpo = null, conToken = true } = {}) {
    const cabeceras = { 'Accept': 'application/json' };
    if (cuerpo) cabeceras['Content-Type'] = 'application/json';

    const token = obtenerToken();
    if (conToken && token) cabeceras['Authorization'] = 'Bearer ' + token;

    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), CONFIG.TIEMPO_MAXIMO_MS);

    try {
        const respuesta = await fetch(CONFIG.SERVICIOS[servicio] + ruta, {
            method: metodo,
            headers: cabeceras,
            body: cuerpo ? JSON.stringify(cuerpo) : null,
            signal: control.signal
        });

        let json = null;
        try { json = await respuesta.json(); } catch (e) { /* respuesta sin JSON */ }

        return {
            ok: respuesta.ok && !!(json && json.success),
            status: respuesta.status,
            mensaje: json && json.message ? json.message : 'Respuesta inesperada del servidor',
            data: json ? json.data : null
        };
    } catch (error) {
        return {
            ok: false,
            status: 0,
            mensaje: 'No se pudo conectar con el servicio de ' + servicio,
            data: null
        };
    } finally {
        clearTimeout(temporizador);
    }
}
