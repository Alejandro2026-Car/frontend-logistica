// CONTROLADOR: panel principal (dashboard.html)
import { protegerPagina } from './SesionGuard.js';
import { ServicioModel, MODULOS } from '../models/ServicioModel.js';
import { DashboardView } from '../views/DashboardView.js';

const usuario = await protegerPagina('panel');

if (usuario) {
    DashboardView.mostrarSaludo(usuario);
    DashboardView.limpiarServicios();

    MODULOS.forEach(async (modulo) => {
        const actualizar = DashboardView.agregarServicio(modulo);
        actualizar(await ServicioModel.estadoDe(modulo.clave));
    });
}
