// Pantalla de inicio de sesión

(function () {
    // Si ya hay sesión guardada, ir directo al panel
    if (obtenerToken()) {
        window.location.replace('dashboard.html');
        return;
    }

    const formulario = document.getElementById('form-login');
    const campoUsuario = document.getElementById('usuario');
    const campoContrasena = document.getElementById('contrasena');
    const boton = document.getElementById('btn-ingresar');
    const aviso = document.getElementById('aviso');

    function mostrarAviso(texto, tipo) {
        aviso.textContent = texto;
        aviso.className = 'aviso aviso--' + tipo;
        aviso.hidden = false;
    }

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        aviso.hidden = true;

        const usuario = campoUsuario.value.trim();
        const contrasena = campoContrasena.value;

        // Validación básica en cliente
        if (usuario === '' || contrasena === '') {
            mostrarAviso('Escribe tu usuario o correo y tu contraseña.', 'error');
            (usuario === '' ? campoUsuario : campoContrasena).focus();
            return;
        }

        boton.disabled = true;
        boton.textContent = 'Ingresando…';

        const resultado = await llamarApi('auth', '/login', {
            metodo: 'POST',
            cuerpo: { usuario, contrasena },
            conToken: false
        });

        if (resultado.ok) {
            guardarSesion(resultado.data.token, resultado.data.usuario);
            mostrarAviso('Sesión iniciada. Entrando al panel…', 'exito');
            window.location.replace('dashboard.html');
            return;
        }

        mostrarAviso(resultado.mensaje, 'error');
        boton.disabled = false;
        boton.textContent = 'Iniciar sesión';
    });
})();
