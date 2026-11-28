// VISTA: pantalla de rutas (tabla, filtros y formulario)
const CAMPOS_FORM = ['ciudad_origen', 'ciudad_destino', 'distancia', 'tiempo_estimado', 'observaciones'];

const $ = (id) => document.getElementById(id);

function celda(texto, clase) {
    const td = document.createElement('td');
    td.textContent = texto;
    if (clase) td.className = clase;
    return td;
}

export const RutasView = {
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
            ciudad: $('f-ciudad').value.trim(),
            origen: $('f-origen').value.trim(),
            destino: $('f-destino').value.trim()
        };
    },

    limpiarFiltros() {
        $('form-filtros').reset();
    },

    // ---------- Tabla ----------
    /**
     * @param {Array} rutas
     * @param {{onEditar:Function, onEliminar:Function}} acciones
     */
    renderTabla(rutas, acciones) {
        const cuerpo = $('cuerpo-tabla');
        cuerpo.innerHTML = '';
        $('sin-resultados').hidden = rutas.length > 0;
        $('tabla-rutas').hidden = rutas.length === 0;

        rutas.forEach((r) => {
            const fila = document.createElement('tr');

            fila.append(
                celda(r.ciudad_origen + ' → ' + r.ciudad_destino, 'ruta-nombre'),
                celda(Number(r.distancia).toLocaleString('es-CO') + ' km'),
                celda(r.tiempo_estimado),
                celda(r.observaciones || '—', 'observaciones')
            );

            const tdAcciones = document.createElement('td');
            tdAcciones.className = 'acciones';

            const btnEditar = document.createElement('button');
            btnEditar.type = 'button';
            btnEditar.className = 'boton boton--secundario boton--chico';
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', () => acciones.onEditar(r));

            const btnEliminar = document.createElement('button');
            btnEliminar.type = 'button';
            btnEliminar.className = 'boton boton--peligro boton--chico';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.addEventListener('click', () => acciones.onEliminar(r));

            tdAcciones.append(btnEditar, btnEliminar);
            fila.appendChild(tdAcciones);

            cuerpo.appendChild(fila);
        });
    },

    // ---------- Formulario (diálogo) ----------
    abrirFormulario(ruta) {
        this.limpiarErrores();
        $('form-ruta').reset();
        $('ruta-id').value = ruta ? ruta.id : '';
        $('titulo-dialogo').textContent = ruta ? 'Editar ruta' : 'Nueva ruta';

        if (ruta) {
            CAMPOS_FORM.forEach((campo) => {
                $(campo).value = ruta[campo] ?? '';
            });
        }

        $('dialogo-ruta').showModal();
        $('ciudad_origen').focus();
    },

    cerrarFormulario() {
        $('dialogo-ruta').close();
    },

    leerFormulario() {
        const datos = {};
        CAMPOS_FORM.forEach((campo) => {
            datos[campo] = $(campo).value.trim();
        });
        return { id: $('ruta-id').value, datos };
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
