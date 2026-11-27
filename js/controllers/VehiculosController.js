// CONTROLADOR: módulo de vehículos (vehiculos.html)
import { protegerPagina } from './SesionGuard.js';
import { VehiculoModel } from '../models/VehiculoModel.js';
import { VehiculosView as Vista } from '../views/VehiculosView.js';

const usuario = await protegerPagina('vehiculos');

if (usuario) {
    document.body.classList.remove('cargando');

    const acciones = {
        onEditar: (vehiculo) => Vista.abrirFormulario(vehiculo),
        onEliminar: eliminar,
        onEstado: cambiarEstado
    };

    async function cargarLista() {
        const res = await VehiculoModel.listar(Vista.leerFiltros());
        if (!res.ok) {
            Vista.mostrarAviso(res.mensaje, 'error');
            return;
        }
        Vista.renderTabla(res.data, acciones);
    }

    async function cambiarEstado(vehiculo, estado) {
        Vista.ocultarAviso();
        const res = await VehiculoModel.cambiarEstado(vehiculo.id, estado);
        Vista.mostrarAviso(res.ok ? 'Estado actualizado.' : res.mensaje, res.ok ? 'exito' : 'error');
        await cargarLista();
    }

    async function eliminar(vehiculo) {
        if (!confirm('¿Eliminar el vehículo ' + vehiculo.placa + '?')) return;
        Vista.ocultarAviso();
        const res = await VehiculoModel.eliminar(vehiculo.id);
        Vista.mostrarAviso(res.ok ? 'Vehículo eliminado.' : res.mensaje, res.ok ? 'exito' : 'error');
        await cargarLista();
    }

    async function guardar(evento) {
        evento.preventDefault();
        const { id, datos } = Vista.leerFormulario();

        const errores = VehiculoModel.validar(datos);
        if (Object.keys(errores).length > 0) {
            Vista.mostrarErrores(errores);
            return;
        }

        Vista.guardando(true);
        const res = id ? await VehiculoModel.actualizar(id, datos) : await VehiculoModel.crear(datos);
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
    document.getElementById('form-vehiculo').addEventListener('submit', guardar);

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
