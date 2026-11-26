// MODELO: sesión del usuario (login, logout, validación)
import { llamarApi } from '../services/ApiService.js';
import { obtenerToken, obtenerUsuario, guardarSesion, limpiarSesion } from '../services/AlmacenSesion.js';

export const SesionModel = {
    hayToken() {
        return !!obtenerToken();
    },

    usuarioGuardado() {
        return obtenerUsuario();
    },

    async iniciarSesion(usuario, contrasena) {
        const resultado = await llamarApi('auth', '/login', {
            metodo: 'POST',
            cuerpo: { usuario, contrasena },
            conToken: false
        });

        if (resultado.ok) {
            guardarSesion(resultado.data.token, resultado.data.usuario);
        }
        return resultado;
    },

    /** Confirma con ms-auth que el token sigue activo. */
    async validar() {
        return llamarApi('auth', '/validar');
    },

    async cerrarSesion() {
        await llamarApi('auth', '/logout', { metodo: 'POST' });
        limpiarSesion();
    }
};
