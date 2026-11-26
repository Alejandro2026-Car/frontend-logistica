// VISTA: pantalla de conductores (tabla, filtros y formulario)
import { ESTADOS_CONDUCTOR } from '../models/ConductorModel.js';

const ETIQUETA_ESTADO = Object.fromEntries(ESTADOS_CONDUCTOR.map((e) => [e.valor, e.texto]));

const CAMPOS_FORM = [
    'nombres', 'apellidos', 'documento', 'telefono', 'correo',
    'numero_licencia', 'categoria_licencia', 'fecha_vencimiento_licencia', 'estado'
];

const $ = (id) => document.getElementById(id);

function celda(texto) {
    const td = document.createElement('td');
    td.textContent = texto;
    return td;
}

export const ConductoresView = {
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
            documento: $('f-documento').value.trim(),
            licencia: $('f-licencia').value.trim(),
            estado: $('f-estado').value
        };
    },

    limpiarFiltros() {
        $('form-filtros').reset();
    },

    // ---------- Tabla ----------
    /**
     * @param {Array} conductores
     * @param {{onEditar:Function, onEliminar:Function, onEstado:Function}} acciones
     */
    renderTabla(conductores, acciones) {
        const cuerpo = $('cuerpo-tabla');
        cuerpo.innerHTML = '';
        $('sin-resultados').hidden = conductores.length > 0;
        $('tabla-conductores').hidden = conductores.length === 0;

        conductores.forEach((c) => {
            const fila = document.createElement('tr');

            fila.append(
                celda(c.nombre_completo),
                celda(c.documento),
                celda(c.telefono),
                celda(c.numero_licencia + ' · ' + c.categoria_licencia)
            );

            // Vencimiento con aviso si ya venció
            const tdFecha = document.createElement('td');
            tdFecha.textContent = c.fecha_vencimiento_licencia;
            if (!c.licencia_vigente) {
                const alerta = document.createElement('span');
                alerta.className = 'etiqueta-alerta';
                alerta.textContent = 'Vencida';
                tdFecha.append(' ', alerta);
            }
            fila.appendChild(tdFecha);

            // Estado como badge
            const tdEstado = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = 'badge badge--' + c.estado;
            badge.textContent = ETIQUETA_ESTADO[c.estado] || c.estado;
            tdEstado.appendChild(badge);
            fila.appendChild(tdEstado);

            // Acciones
            const tdAcciones = document.createElement('td');
            tdAcciones.className = 'acciones';

            const selector = document.createElement('select');
            selector.setAttribute('aria-label', 'Cambiar estado de ' + c.nombre_completo);
            ESTADOS_CONDUCTOR.forEach((e) => {
                const op = document.createElement('option');
                op.value = e.valor;
                op.textContent = e.texto;
                op.selected = e.valor === c.estado;
                selector.appendChild(op);
            });
            selector.addEventListener('change', () => acciones.onEstado(c, selector.value));

            const btnEditar = document.createElement('button');
            btnEditar.type = 'button';
            btnEditar.className = 'boton boton--secundario boton--chico';
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', () => acciones.onEditar(c));

            const btnEliminar = document.createElement('button');
            btnEliminar.type = 'button';
            btnEliminar.className = 'boton boton--peligro boton--chico';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.addEventListener('click', () => acciones.onEliminar(c));

            tdAcciones.append(selector, btnEditar, btnEliminar);
            fila.appendChild(tdAcciones);

            cuerpo.appendChild(fila);
        });
    },

    // ---------- Formulario (diálogo) ----------
    abrirFormulario(conductor) {
        this.limpiarErrores();
        $('form-conductor').reset();
        $('conductor-id').value = conductor ? conductor.id : '';
        $('titulo-dialogo').textContent = conductor ? 'Editar conductor' : 'Nuevo conductor';

        if (conductor) {
            CAMPOS_FORM.forEach((campo) => {
                $(campo).value = conductor[campo] ?? '';
            });
        } else {
            $('estado').value = 'disponible';
        }

        $('dialogo-conductor').showModal();
        $('nombres').focus();
    },

    cerrarFormulario() {
        $('dialogo-conductor').close();
    },

    leerFormulario() {
        const datos = {};
        CAMPOS_FORM.forEach((campo) => {
            datos[campo] = $(campo).value.trim();
        });
        return { id: $('conductor-id').value, datos };
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
