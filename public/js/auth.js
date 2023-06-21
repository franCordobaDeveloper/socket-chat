// Referencias HTML
const miFormulario = document.querySelector('form');



const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth';

miFormulario.addEventListener('submit', ( e ) => {

    e.preventDefault();

    const formData = {};

    for( let el of miFormulario.elements ) {
        if( el.name.length > 0 ) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + '/login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ) {
            return console.error( msg );
        }
        console.log( token );
        localStorage.setItem('token', token );
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log( err );
    });

    console.log( formData );

});

function handleCredentialResponse(response) {
           
    // Google Token:  ID_TOKEN
    //console.log('id_token', response.credential );
    
    const body = { id_token: response.credential };

    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( body )
    })
        .then( resp => resp.json() )
        .then( ({ token }) => {
            console.log( token );
            localStorage.setItem('token', token );
            window.location = 'chat.html';
        })
        // .then( resp => {
        //     console.log( resp );
        //     localStorage.setItem('email', resp.usuario.correo );
        // })
        .catch( console.warn );       
    }

const button = document.getElementById("google_signout");

button.onclick = () => {
    // console.log( google.accounts.id );

    google.accounts.id.disabledAutoSelect();

    google.accounts.id.revoke( localStorage.getItem( 'email' ), done => {
        localStorage.clear()
        location.reload();
    });
}