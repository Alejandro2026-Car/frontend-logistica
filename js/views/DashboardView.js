// VISTA: panel principal
export const DashboardView = {
    mostrarSaludo(usuario) {
        document.getElementById('saludo').textContent = 'Hola, ' + usuario.nombre.split(' ')[0];
        document.body.classList.remove('cargando');
    },

    /** Crea la fila de un servicio y devuelve una función para actualizar su estado. */
    agregarServicio(modulo) {
        const lista = document.getElementById('lista-servicios');

        const fila = document.createElement('li');
        fila.className = 'servicio servicio--revisando';

        const punto = document.createElement('span');
        punto.className = 'servicio__punto';
        punto.setAttribute('aria-hidden', 'true');

        const texto = document.createElement('span');
        texto.className = 'servicio__texto';
        const nombre = document.createElement('strong');
        nombre.textContent = modulo.nombre;
        const detalle = document.createElement('small');
        detalle.textContent = modulo.detalle;
        texto.append(nombre, detalle);

        const estado = document.createElement('span');
        estado.className = 'servicio__estado';
        estado.textContent = 'Revisando…';

        fila.append(punto, texto, estado);
        lista.appendChild(fila);

        return (resultado) => {
            fila.classList.remove('servicio--revisando');
            if (resultado === 'ok') {
                fila.classList.add('servicio--ok');
                estado.textContent = 'En línea';
            } else if (resultado === 'sin_bd') {
                fila.classList.add('servicio--alerta');
                estado.textContent = 'Sin base de datos';
            } else {
                fila.classList.add('servicio--caido');
                estado.textContent = 'Sin respuesta';
            }
        };
    },

    limpiarServicios() {
        document.getElementById('lista-servicios').innerHTML = '';
    }
};
