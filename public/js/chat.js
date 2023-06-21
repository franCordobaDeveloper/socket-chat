let usuario = null;
let socket  = null;

const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth';

// Referencias HTML
const txtUid     = document.getElementById('txtUid');
const txtMensaje = document.getElementById('txtMensaje');
const ulUsuarios = document.getElementById('ulUsuarios');
const ulMensajes = document.getElementById('ulMensajes');
const btnSalir   = document.getElementById('btnSalir');


// Validar el token del localstorage
const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB );
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
    
}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token'),
        }
    });

    socket.on('connect', () => {
        console.log('SocketChat Online');
    });

    socket.on('disconnect', () => {
        console.log('SocketChat Offline');
    });

    socket.on('recibir-mensaje', ( payload ) => {
        dibujarMensajes( payload );

    });

    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mensaje-privado', () => {

    });


}


const dibujarUsuarios = ( usuarios = []) => {

    let usuariosHtml = '';
    usuarios.forEach( ({ nombre, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usuariosHtml;

}

const dibujarMensajes = ( mensajes = []) => {

    let mensajesHtml = '';
    mensajes.forEach( ({ mensaje, nombre }) => {

        usersHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${ nombre } </span>
                    <span">${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = mensajesHtml;

}


txtMensaje.addEventListener('keyup', ({ KeyCode }) => {
    
    const mensaje = txtMensaje.value;
    const uid     = txtMensaje.value;
    
    if( KeyCode !== 13 ) { return; }

    if( mensaje.length === 0 ) { return; }

    socket.emit('enviar-mensaje', { mensaje, uid } );
    txtMensaje.value = '';
});

const main = async() => {
    // Validar JWT
    await validarJWT();
}

main();