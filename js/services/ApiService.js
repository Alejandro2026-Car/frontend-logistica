// Cliente HTTP para los microservicios (usa fetch)
import { CONFIG } from '../config.js';
import { obtenerToken, limpiarSesion } from './AlmacenSesion.js';

/**
 * @param {string} servicio  clave de CONFIG.SERVICIOS (auth, conductores, ...)
 * @param {string} ruta      por ejemplo '/login' o '?estado=disponible'
 * @param {{metodo?:string, cuerpo?:object|null, conToken?:boolean}} opciones
 * @returns {Promise<{ok:boolean,status:number,mensaje:string,data:any,errores:object|null}>}
 */
export async function llamarApi(servicio, ruta, { metodo = 'GET', cuerpo = null, conToken = true } = {}) {
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

        // Token vencido o inválido en una pantalla protegida: volver al login
        if (respuesta.status === 401 && conToken) {
            limpiarSesion();
            window.location.replace('index.html');
        }

        return {
            ok: respuesta.ok && !!(json && json.success),
            status: respuesta.status,
            mensaje: json && json.message ? json.message : 'Respuesta inesperada del servidor',
            data: json ? json.data : null,
            errores: json && json.errors ? json.errors : null
        };
    } catch (error) {
        return {
            ok: false,
            status: 0,
            mensaje: 'No se pudo conectar con el servicio de ' + servicio,
            data: null,
            errores: null
        };
    } finally {
        clearTimeout(temporizador);
    }
}
