// Utilidad compartida por las pantallas protegidas:
// exige token, lo valida con ms-auth, dibuja la barra y conecta "Cerrar sesión".
import { SesionModel } from '../models/SesionModel.js';
import { BarraView } from '../views/BarraView.js';

/** @returns {Promise<object|null>} el usuario, o null si fue redirigido al login */
export async function protegerPagina(seccionActiva) {
    if (!SesionModel.hayToken()) {
        window.location.replace('index.html');
        return null;
    }

    const sesion = await SesionModel.validar();
    if (!sesion.ok) {
        await SesionModel.cerrarSesion();
        window.location.replace('index.html');
        return null;
    }

    const usuario = sesion.data.usuario;

    BarraView.render(seccionActiva, usuario, async () => {
        await SesionModel.cerrarSesion();
        window.location.replace('index.html');
    });

    return usuario;
}
