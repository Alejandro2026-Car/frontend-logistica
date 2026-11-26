// MODELO: estado de los microservicios
import { llamarApi } from '../services/ApiService.js';

export const MODULOS = [
    { clave: 'auth',        nombre: 'Autenticación',        detalle: 'ms-auth · puerto 8001' },
    { clave: 'conductores', nombre: 'Conductores',          detalle: 'ms-conductores · puerto 8002' },
    { clave: 'vehiculos',   nombre: 'Vehículos',            detalle: 'ms-vehiculos · puerto 8003' },
    { clave: 'rutas',       nombre: 'Rutas y programación', detalle: 'ms-rutas · puerto 8004' },
    { clave: 'viajes',      nombre: 'Viajes y seguimiento', detalle: 'ms-viajes · puerto 8005' }
];

export const ServicioModel = {
    /** @returns {Promise<'ok'|'sin_bd'|'caido'>} */
    async estadoDe(clave) {
        const res = await llamarApi(clave, '/salud', { conToken: false });
        if (res.ok) return 'ok';
        if (res.status === 503) return 'sin_bd';
        return 'caido';
    }
};
