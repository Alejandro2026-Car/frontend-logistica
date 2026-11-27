// VISTA: pantalla de vehículos (tabla, filtros y formulario)
import { ESTADOS_VEHICULO } from '../models/VehiculoModel.js';

const ETIQUETA_ESTADO = Object.fromEntries(ESTADOS_VEHICULO.map((e) => [e.valor, e.texto]));

const CAMPOS_FORM = ['placa', 'tipo_vehiculo', 'capacidad_carga', 'marca', 'modelo', 'estado'];

const $ = (id) => document.getElementById(id);

function celda(texto) {
    const td = document.createElement('td');
    td.textContent = texto;
    return td;
}

export const VehiculosView = {
    // ---------- Avisos ----------
    mostrarAviso(texto, tipo) {
        const aviso = $('aviso');
        aviso.textContent = texto;
        aviso.className = 'aviso aviso--' + tipo;
        aviso.hidden = false;
    },

    ocultarAviso() {
        $('aviso').hidden = true;
    },

    // ---------- Filtros ----------
    leerFiltros() {
        return {
            placa: $('f-placa').value.trim(),
            tipo: $('f-tipo').value.trim(),
            estado: $('f-estado').value
        };
    },

    limpiarFiltros() {
        $('form-filtros').reset();
    },

    // ---------- Tabla ----------
    /**
     * @param {Array} vehiculos
     * @param {{onEditar:Function, onEliminar:Function, onEstado:Function}} acciones
     */
    renderTabla(vehiculos, acciones) {
        const cuerpo = $('cuerpo-tabla');
        cuerpo.innerHTML = '';
        $('sin-resultados').hidden = vehiculos.length > 0;
        $('tabla-vehiculos').hidden = vehiculos.length === 0;

        vehiculos.forEach((v) => {
            const fila = document.createElement('tr');

            const tdPlaca = celda(v.placa);
            tdPlaca.className = 'placa';

            fila.append(
                tdPlaca,
                celda(v.tipo_vehiculo),
                celda(v.marca),
                celda(v.modelo),
                celda(Number(v.capacidad_carga).toLocaleString('es-CO'))
            );

            // Estado como badge
            const tdEstado = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = 'badge badge--' + v.estado;
            badge.textContent = ETIQUETA_ESTADO[v.estado] || v.estado;
            tdEstado.appendChild(badge);
            fila.appendChild(tdEstado);

            // Acciones
            const tdAcciones = document.createElement('td');
            tdAcciones.className = 'acciones';

            const selector = document.createElement('select');
            selector.setAttribute('aria-label', 'Cambiar estado del vehículo ' + v.placa);
            ESTADOS_VEHICULO.forEach((e) => {
                const op = document.createElement('option');
                op.value = e.valor;
                op.textContent = e.texto;
                op.selected = e.valor === v.estado;
                selector.appendChild(op);
            });
            selector.addEventListener('change', () => acciones.onEstado(v, selector.value));

            const btnEditar = document.createElement('button');
            btnEditar.type = 'button';
            btnEditar.className = 'boton boton--secundario boton--chico';
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', () => acciones.onEditar(v));

            const btnEliminar = document.createElement('button');
            btnEliminar.type = 'button';
            btnEliminar.className = 'boton boton--peligro boton--chico';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.addEventListener('click', () => acciones.onEliminar(v));

            tdAcciones.append(selector, btnEditar, btnEliminar);
            fila.appendChild(tdAcciones);

            cuerpo.appendChild(fila);
        });
    },

    // ---------- Formulario (diálogo) ----------
    abrirFormulario(vehiculo) {
        this.limpiarErrores();
        $('form-vehiculo').reset();
        $('vehiculo-id').value = vehiculo ? vehiculo.id : '';
        $('titulo-dialogo').textContent = vehiculo ? 'Editar vehículo' : 'Nuevo vehículo';

        if (vehiculo) {
            CAMPOS_FORM.forEach((campo) => {
                $(campo).value = vehiculo[campo] ?? '';
            });
        } else {
            $('estado').value = 'disponible';
        }

        $('dialogo-vehiculo').showModal();
        $('placa').focus();
    },

    cerrarFormulario() {
        $('dialogo-vehiculo').close();
    },

    leerFormulario() {
        const datos = {};
        CAMPOS_FORM.forEach((campo) => {
            datos[campo] = $(campo).value.trim();
        });
        datos.placa = datos.placa.toUpperCase();
        return { id: $('vehiculo-id').value, datos };
    },

    mostrarErrores(errores) {
        this.limpiarErrores();
        Object.entries(errores).forEach(([campo, mensaje]) => {
            const lugar = $('error-' + campo);
            if (lugar) lugar.textContent = mensaje;
        });
    },

    limpiarErrores() {
        document.querySelectorAll('.campo-error').forEach((e) => { e.textContent = ''; });
    },

    guardando(activo) {
        const boton = $('btn-guardar');
        boton.disabled = activo;
        boton.textContent = activo ? 'Guardando…' : 'Guardar';
    }
};
