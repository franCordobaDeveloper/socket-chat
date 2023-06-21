const { request, response } = require("express")
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { emailExiste } = require("../middlewares/validar-campos");



const usuariosGet = async (req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    // Validamos que el valor recibido en desde es un numero
    if( isNaN( desde ) ) {
        return res.status(400).json({
            msg: 'el query desde debe ser un numero'
        });
    }

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req = request, res = response ) => {

    const { nombre, correo, password, rol } = req.body;

    // Creamos una instancia nueva de un usuario
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );


    // Grabar registro en la db
    await usuario.save();

    res.json({
        usuario
    });
}


const usuariosPut = async (req = request, res = response ) => {

    const { id } = req.params;

    const { _id, password, google, correo ,...resto } = req.body;

    // TODO validar contra base de datos
    // Si mandan el password significa que quiere cambiar el password
    // debo actualizar el hash de la contraseña
    if( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    // Actualizo lo que viene en el ...resto que me envian en el req.body
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
}

const usuariosDelete = async (req = request, res = response ) => {
    
    const { id } = req.params;

    // Cambiar el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate( id , { estado : false } );
    
    res.json( usuario );
}




// Exportaciones
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
}
