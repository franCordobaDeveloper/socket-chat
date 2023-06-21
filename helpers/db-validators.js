const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');


const esRoleValido =  async ( rol = '' ) => {
    
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ) {
        throw new Error(`El rol ${ rol } no esta en la base de datos`);
    } 

}

const emailExiste = async ( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });

    if( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya esta registrado `);
    }

}

const existeUsuarioPorId = async ( id ) => {

    const existeUsuario = await Usuario.findById( id );

    if( !existeUsuario ) { 
        throw new Error(`El ID no existe: ${ id } `);
    }

}

/**
 *  Categorias
 */
const existeCategoriaPorId = async ( id ) => {

    const existeCategoria = await Categoria.findById( id );

    if( !existeCategoria ) {
        throw new Error(`El ID no existe: ${ id }`);
    }

}

/**
 *  Producto
 */
const existeProductoPorId = async ( id ) => {

    const existeProducto = await Producto.findById( id );

    if( !existeProducto ) {
        throw new Error(`El ID no existe: ${ id }`);
    }

}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}