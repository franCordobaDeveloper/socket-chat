
// Configuracion de express
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/socketController');

class Server {

    constructor() {

        this.app    = express();
        this.port   = process.env.PORT;
        this.server = createServer( this.app );
        this.io     = require('socket.io')( this.server );


        // rutas
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios:   '/api/usuarios',
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi app
        this.routes();

        // Sockets
        this.sockets();
    }

    // Metodo coneccion a db
    async conectarDB () {
        await dbConnection();
    }


    // Middlewares
    middlewares() {
        
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Publico
        this.app.use( express.static('public') );
    }


    // Metodos
    routes() {

        this.app.use( this.paths.usuarios ,  require('../routes/usuarios') );
        // this.app.use( this.paths.categorias, require('../routes/categorias') );
        // this.app.use( this.paths.productos,  require('../routes/productos') );

        // // ruta de busqueda
        // this.app.use( this.paths.buscar,     require('../routes/buscar') );
        
        // ruta de autenticacion
        this.app.use( this.paths.auth,       require('../routes/auth') );
        
    }

    sockets() {
        this.io.on('connection', ( socket ) => socketController( socket, this.io ) );
    }


    listen() {
        this.server.listen( this.port, () => {
            console.log('Servervidor corriendo en puerto', this.port );
        });
        
    }

}




module.exports = Server;