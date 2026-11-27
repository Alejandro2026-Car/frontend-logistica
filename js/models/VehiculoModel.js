// MODELO: vehículos (datos, validación en cliente y llamadas a ms-vehiculos)
import { llamarApi } from '../services/ApiService.js';

export const ESTADOS_VEHICULO = [
    { valor: 'disponible',    texto: 'Disponible' },
    { valor: 'en_ruta',       texto: 'En ruta' },
    { valor: 'mantenimiento', texto: 'Mantenimiento' },
    { valor: 'inactivo',      texto: 'Inactivo' }
];

export const VehiculoModel = {
    async listar(filtros = {}) {
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([clave, valor]) => {
            if (valor) params.append(clave, valor);
        });
        const consulta = params.toString();
        return llamarApi('vehiculos', consulta ? '?' + consulta : '');
    },

    obtener(id) {
        return llamarApi('vehiculos', '/' + id);
    },

    crear(datos) {
        return llamarApi('vehiculos', '', { metodo: 'POST', cuerpo: datos });
    },

    actualizar(id, datos) {
        return llamarApi('vehiculos', '/' + id, { metodo: 'PUT', cuerpo: datos });
    },

    cambiarEstado(id, estado) {
        return llamarApi('vehiculos', '/' + id + '/estado', { metodo: 'PATCH', cuerpo: { estado } });
    },

    eliminar(id) {
        return llamarApi('vehiculos', '/' + id, { metodo: 'DELETE' });
    },

    /** Validación rápida antes de enviar. El servidor vuelve a validar todo. */
    validar(d) {
        const errores = {};
        const obligatorios = {
            placa: 'La placa es obligatoria',
            tipo_vehiculo: 'El tipo de vehículo es obligatorio',
            capacidad_carga: 'La capacidad de carga es obligatoria',
            modelo: 'El modelo es obligatorio',
            marca: 'La marca es obligatoria'
        };

        Object.entries(obligatorios).forEach(([campo, mensaje]) => {
            if (!d[campo] || String(d[campo]).trim() === '') errores[campo] = mensaje;
        });

        if (!errores.placa && !/^[A-Za-z0-9-]{5,10}$/.test(d.placa)) {
            errores.placa = 'De 5 a 10 caracteres (letras, números o guion)';
        }
        if (!errores.capacidad_carga && !(Number(d.capacidad_carga) > 0)) {
            errores.capacidad_carga = 'Debe ser un número mayor que 0';
        }

        return errores;
    }
};
