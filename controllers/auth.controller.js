const { response, request, json } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");




const login = async ( req = request , res = response) => {

    const { correo, password } = req.body;


    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - correo"
            });
        }

        // Verificar si el usuario esta activo en la db
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar Contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );

        if( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto - password'
            });
        }

        // Generar JWT

        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        
        console.log( error );

        res.status(500).json({
            msg: 'Hable con el admin'
        });
    }

    

}


const googleSignIn = async ( req = request , res = response ) => {

    const { id_token } = req.body;

    try {
        
        const{ nombre, img, correo } = await googleVerify( id_token );

        // Generar referencia para saber si el email ya esta registrado
        let usuario = await Usuario.findOne( { correo } );

        if( !usuario ) {
            // Si el usuario no existe debo crearlo
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true,
            };

            usuario = new Usuario( data );

            await usuario.save();

        }

        // Si el usuario en DB tiene estado: false
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el admin, usuario bloqueado'
            });
        }

        // Generar jwt 

        const token = await generarJWT( usuario.id );

        
        res.json({
            usuario,
            token
        });

    } catch ( error ) {

        console.log( error );
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    
    }

}

const renovarToken = async ( req, res = response ) => {

    const { usuario } = req;

    // Generar Nuevo JWT
    const token = await generarJWT( usuario.uid )

    res.json({
        usuario,
        token
    });
}


module.exports = {
    login,
    googleSignIn,
    renovarToken
}