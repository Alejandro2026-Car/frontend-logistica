// CONTROLADOR: módulo de conductores (conductores.html)
import { protegerPagina } from './SesionGuard.js';
import { ConductorModel } from '../models/ConductorModel.js';
import { ConductoresView as Vista } from '../views/ConductoresView.js';

const usuario = await protegerPagina('conductores');

if (usuario) {
    document.body.classList.remove('cargando');

    const acciones = {
        onEditar: (conductor) => Vista.abrirFormulario(conductor),
        onEliminar: eliminar,
        onEstado: cambiarEstado
    };

    async function cargarLista() {
        const res = await ConductorModel.listar(Vista.leerFiltros());
        if (!res.ok) {
            Vista.mostrarAviso(res.mensaje, 'error');
            return;
        }
        Vista.renderTabla(res.data, acciones);
    }

    async function cambiarEstado(conductor, estado) {
        Vista.ocultarAviso();
        const res = await ConductorModel.cambiarEstado(conductor.id, estado);
        Vista.mostrarAviso(res.ok ? 'Estado actualizado.' : res.mensaje, res.ok ? 'exito' : 'error');
        await cargarLista();
    }

    async function eliminar(conductor) {
        if (!confirm('¿Eliminar a ' + conductor.nombre_completo + '?')) return;
        Vista.ocultarAviso();
        const res = await ConductorModel.eliminar(conductor.id);
        Vista.mostrarAviso(res.ok ? 'Conductor eliminado.' : res.mensaje, res.ok ? 'exito' : 'error');
        await cargarLista();
    }

    async function guardar(evento) {
        evento.preventDefault();
        const { id, datos } = Vista.leerFormulario();

        const errores = ConductorModel.validar(datos);
        if (Object.keys(errores).length > 0) {
            Vista.mostrarErrores(errores);
            return;
        }

        Vista.guardando(true);
        const res = id ? await ConductorModel.actualizar(id, datos) : await ConductorModel.crear(datos);
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
    document.getElementById('form-conductor').addEventListener('submit', guardar);

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
