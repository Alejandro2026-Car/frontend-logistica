// MODELO: rutas (datos, validación en cliente y llamadas a ms-rutas)
import { llamarApi } from '../services/ApiService.js';

export const RutaModel = {
    async listar(filtros = {}) {
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([clave, valor]) => {
            if (valor) params.append(clave, valor);
        });
        const consulta = params.toString();
        return llamarApi('rutas', consulta ? '?' + consulta : '');
    },

    obtener(id) {
        return llamarApi('rutas', '/' + id);
    },

    crear(datos) {
        return llamarApi('rutas', '', { metodo: 'POST', cuerpo: datos });
    },

    actualizar(id, datos) {
        return llamarApi('rutas', '/' + id, { metodo: 'PUT', cuerpo: datos });
    },

    eliminar(id) {
        return llamarApi('rutas', '/' + id, { metodo: 'DELETE' });
    },

    /** Validación rápida antes de enviar. El servidor vuelve a validar todo. */
    validar(d) {
        const errores = {};
        const obligatorios = {
            ciudad_origen: 'La ciudad de origen es obligatoria',
            ciudad_destino: 'La ciudad de destino es obligatoria',
            distancia: 'La distancia es obligatoria',
            tiempo_estimado: 'El tiempo estimado es obligatorio'
        };

        Object.entries(obligatorios).forEach(([campo, mensaje]) => {
            if (!d[campo] || String(d[campo]).trim() === '') errores[campo] = mensaje;
        });

        if (!errores.distancia && !(Number(d.distancia) > 0)) {
            errores.distancia = 'Debe ser un número mayor que 0';
        }
        if (!errores.ciudad_origen && !errores.ciudad_destino
            && d.ciudad_origen.toLowerCase() === d.ciudad_destino.toLowerCase()) {
            errores.ciudad_destino = 'El destino debe ser distinto del origen';
        }

        return errores;
    }
};
