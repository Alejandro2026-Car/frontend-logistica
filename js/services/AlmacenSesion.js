// Guarda y lee el token y el usuario en el navegador (localStorage)
import { CONFIG } from '../config.js';

export function obtenerToken() {
    return localStorage.getItem(CONFIG.CLAVE_TOKEN);
}

export function obtenerUsuario() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.CLAVE_USUARIO));
    } catch (e) {
        return null;
    }
}

export function guardarSesion(token, usuario) {
    localStorage.setItem(CONFIG.CLAVE_TOKEN, token);
    localStorage.setItem(CONFIG.CLAVE_USUARIO, JSON.stringify(usuario));
}

export function limpiarSesion() {
    localStorage.removeItem(CONFIG.CLAVE_TOKEN);
    localStorage.removeItem(CONFIG.CLAVE_USUARIO);
}
