// Direcciones de los microservicios (cada uno corre en su propio puerto)
const CONFIG = {
    SERVICIOS: {
        auth:        'http://localhost:8001/api/auth',
        conductores: 'http://localhost:8002/api/conductores',
        vehiculos:   'http://localhost:8003/api/vehiculos',
        rutas:       'http://localhost:8004/api/rutas',
        viajes:      'http://localhost:8005/api/viajes'
    },
    CLAVE_TOKEN: 'logitrans_token',
    CLAVE_USUARIO: 'logitrans_usuario',
    TIEMPO_MAXIMO_MS: 5000
};
