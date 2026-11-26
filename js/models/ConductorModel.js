// MODELO: conductores (datos, validación en cliente y llamadas a ms-conductores)
import { llamarApi } from '../services/ApiService.js';

export const ESTADOS_CONDUCTOR = [
    { valor: 'disponible', texto: 'Disponible' },
    { valor: 'en_ruta',    texto: 'En ruta' },
    { valor: 'inactivo',   texto: 'Inactivo' }
];

export const ConductorModel = {
    async listar(filtros = {}) {
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([clave, valor]) => {
            if (valor) params.append(clave, valor);
        });
        const consulta = params.toString();
        return llamarApi('conductores', consulta ? '?' + consulta : '');
    },

    obtener(id) {
        return llamarApi('conductores', '/' + id);
    },

    crear(datos) {
        return llamarApi('conductores', '', { metodo: 'POST', cuerpo: datos });
    },

    actualizar(id, datos) {
        return llamarApi('conductores', '/' + id, { metodo: 'PUT', cuerpo: datos });
    },

    cambiarEstado(id, estado) {
        return llamarApi('conductores', '/' + id + '/estado', { metodo: 'PATCH', cuerpo: { estado } });
    },

    eliminar(id) {
        return llamarApi('conductores', '/' + id, { metodo: 'DELETE' });
    },

    /** Validación rápida antes de enviar. El servidor vuelve a validar todo. */
    validar(d) {
        const errores = {};
        const obligatorios = {
            nombres: 'Los nombres son obligatorios',
            apellidos: 'Los apellidos son obligatorios',
            documento: 'El documento es obligatorio',
            telefono: 'El teléfono es obligatorio',
            correo: 'El correo es obligatorio',
            numero_licencia: 'El número de licencia es obligatorio',
            categoria_licencia: 'La categoría es obligatoria',
            fecha_vencimiento_licencia: 'La fecha de vencimiento es obligatoria'
        };

        Object.entries(obligatorios).forEach(([campo, mensaje]) => {
            if (!d[campo] || String(d[campo]).trim() === '') errores[campo] = mensaje;
        });

        if (!errores.documento && !/^[0-9]{5,20}$/.test(d.documento)) {
            errores.documento = 'Solo números (5 a 20 dígitos)';
        }
        if (!errores.telefono && !/^\+?[0-9]{7,15}$/.test(d.telefono)) {
            errores.telefono = 'Entre 7 y 15 dígitos';
        }
        if (!errores.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo)) {
            errores.correo = 'El correo no es válido';
        }
        if (!errores.fecha_vencimiento_licencia) {
            const hoy = new Date().toLocaleDateString('sv-SE'); // AAAA-MM-DD en hora local
            if (d.fecha_vencimiento_licencia < hoy) {
                errores.fecha_vencimiento_licencia = 'La licencia está vencida';
            }
        }

        return errores;
    }
};
