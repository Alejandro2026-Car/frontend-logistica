// CONTROLADOR: pantalla de login (index.html)
import { SesionModel } from '../models/SesionModel.js';
import { LoginView } from '../views/LoginView.js';

if (SesionModel.hayToken()) {
    window.location.replace('dashboard.html');
} else {
    LoginView.formulario().addEventListener('submit', async (evento) => {
        evento.preventDefault();
        LoginView.ocultarAviso();

        const { usuario, contrasena } = LoginView.leerCampos();

        if (usuario === '' || contrasena === '') {
            LoginView.mostrarAviso('Escribe tu usuario o correo y tu contraseña.', 'error');
            LoginView.enfocar(usuario === '' ? 'usuario' : 'contrasena');
            return;
        }

        LoginView.cargando(true);
        const resultado = await SesionModel.iniciarSesion(usuario, contrasena);

        if (resultado.ok) {
            LoginView.mostrarAviso('Sesión iniciada. Entrando al panel…', 'exito');
            window.location.replace('dashboard.html');
            return;
        }

        LoginView.mostrarAviso(resultado.mensaje, 'error');
        LoginView.cargando(false);
    });
}
