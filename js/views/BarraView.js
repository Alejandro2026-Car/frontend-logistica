// VISTA: barra superior con navegación y datos del usuario
const SECCIONES = [
    { clave: 'panel',       texto: 'Panel',       href: 'dashboard.html' },
    { clave: 'conductores', texto: 'Conductores', href: 'conductores.html' },
    { clave: 'vehiculos',   texto: 'Vehículos',   href: null },
    { clave: 'rutas',       texto: 'Rutas',       href: null },
    { clave: 'viajes',      texto: 'Viajes',      href: null }
];

export const BarraView = {
    /**
     * @param {string} activa  clave de la sección actual
     * @param {{nombre:string, rol:string}} usuario
     * @param {() => void} alSalir  se ejecuta al pulsar "Cerrar sesión"
     */
    render(activa, usuario, alSalir) {
        const contenedor = document.getElementById('barra');
        contenedor.innerHTML = '';

        const barra = document.createElement('header');
        barra.className = 'barra';

        const marca = document.createElement('span');
        marca.className = 'barra__marca';
        marca.textContent = 'LogiTrans Express';

        const nav = document.createElement('nav');
        nav.className = 'barra__nav';
        nav.setAttribute('aria-label', 'Módulos');

        SECCIONES.forEach((s) => {
            const enlace = document.createElement('a');
            enlace.textContent = s.texto;
            if (s.href) {
                enlace.href = s.href;
            } else {
                enlace.href = '#';
                enlace.setAttribute('aria-disabled', 'true');
                enlace.addEventListener('click', (e) => e.preventDefault());
            }
            if (s.clave === activa) enlace.setAttribute('aria-current', 'page');
            nav.appendChild(enlace);
        });

        const zonaUsuario = document.createElement('div');
        zonaUsuario.className = 'barra__usuario';

        const datos = document.createElement('span');
        const nombre = document.createElement('strong');
        nombre.textContent = usuario.nombre;
        const rol = document.createElement('small');
        rol.textContent = ' ' + usuario.rol;
        datos.append(nombre, rol);

        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'boton boton--secundario';
        boton.textContent = 'Cerrar sesión';
        boton.addEventListener('click', alSalir);

        zonaUsuario.append(datos, boton);
        barra.append(marca, nav, zonaUsuario);
        contenedor.appendChild(barra);
    }
};
