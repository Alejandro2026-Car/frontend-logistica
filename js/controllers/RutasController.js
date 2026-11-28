// CONTROLADOR: módulo de rutas (rutas.html)
import { protegerPagina } from './SesionGuard.js';
import { RutaModel } from '../models/RutaModel.js';
import { RutasView as Vista } from '../views/RutasView.js';

const usuario = await protegerPagina('rutas');

if (usuario) {
    document.body.classList.remove('cargando');

    const acciones = {
        onEditar: (ruta) => Vista.abrirFormulario(ruta),
        onEliminar: eliminar
    };

    async function cargarLista() {
        const res = await RutaModel.listar(Vista.leerFiltros());
        if (!res.ok) {
            Vista.mostrarAviso(res.mensaje, 'error');
            return;
        }
        Vista.renderTabla(res.data, acciones);
    }

    async function eliminar(ruta) {
        if (!confirm('¿Eliminar la ruta ' + ruta.nombre + '?')) return;
        Vista.ocultarAviso();
        const res = await RutaModel.eliminar(ruta.id);
        Vista.mostrarAviso(res.ok ? 'Ruta eliminada.' : res.mensaje, res.ok ? 'exito' : 'error');
        await cargarLista();
    }

    async function guardar(evento) {
        evento.preventDefault();
        const { id, datos } = Vista.leerFormulario();

        const errores = RutaModel.validar(datos);
        if (Object.keys(errores).length > 0) {
            Vista.mostrarErrores(errores);
            return;
        }

        Vista.guardando(true);
        const res = id ? await RutaModel.actualizar(id, datos) : await RutaModel.crear(datos);
        Vista.guardando(false);

        if (!res.ok) {
            // Errores de validación del servidor (422) o mensaje general
            if (res.errores) {
                Vista.mostrarErrores(res.errores);
            } else {
                Vista.mostrarErrores({});
                Vista.mostrarAviso(res.mensaje, 'error');
            }
            return;
        }

        Vista.cerrarFormulario();
        Vista.mostrarAviso(res.mensaje, 'exito');
        await cargarLista();
    }

    document.getElementById('btn-nuevo').addEventListener('click', () => Vista.abrirFormulario(null));
    document.getElementById('btn-cancelar').addEventListener('click', () => Vista.cerrarFormulario());
    document.getElementById('form-ruta').addEventListener('submit', guardar);

    document.getElementById('form-filtros').addEventListener('submit', (e) => {
        e.preventDefault();
        Vista.ocultarAviso();
        cargarLista();
    });
    document.getElementById('btn-limpiar').addEventListener('click', () => {
        Vista.limpiarFiltros();
        cargarLista();
    });

    await cargarLista();
}
