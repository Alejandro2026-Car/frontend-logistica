// VISTA: formulario de inicio de sesión
export const LoginView = {
    formulario: () => document.getElementById('form-login'),

    leerCampos() {
        return {
            usuario: document.getElementById('usuario').value.trim(),
            contrasena: document.getElementById('contrasena').value
        };
    },

    enfocar(campo) {
        document.getElementById(campo).focus();
    },

    mostrarAviso(texto, tipo) {
        const aviso = document.getElementById('aviso');
        aviso.textContent = texto;
        aviso.className = 'aviso aviso--' + tipo;
        aviso.hidden = false;
    },

    ocultarAviso() {
        document.getElementById('aviso').hidden = true;
    },

    cargando(activo) {
        const boton = document.getElementById('btn-ingresar');
        boton.disabled = activo;
        boton.textContent = activo ? 'Ingresando…' : 'Iniciar sesión';
    }
};
