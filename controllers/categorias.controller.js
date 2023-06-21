const { request, response } = require("express");
const { Categoria } = require("../models");

// obtenerCategorias - paginado - total categoria - populate

const obtenerCategorias = async ( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    if ( isNaN( desde ) ) {
        return res.status(400).json({
            msg: 'El query debe de ser un Numero.'
        });
    }

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
            .populate('usuario', 'nombre' )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        categorias
    });

}


// obtenerCategoria - populate {}

const obtenerCategoria = async ( req = request, res = response ) => {
    
    const { id } = req.params;
    
    const categoriaDB = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.json( categoriaDB );
}

const crearCategorias = async ( req = request, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La Categoria: ${ categoriaDB.nombre }, ya existe!`
        });
    }

   // Generar la data a guardar
   const data = {
        nombre,
        usuario: req.usuario._id
   }

   const categoria = new Categoria( data );

   // Guardar DB
   await categoria.save();


   res.status(201).json( categoria );
}


// actualizarCategoria 

const actualizarCategoria = async ( req = request, res = response ) => {
    
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;


    const categoriaActualizada = await Categoria.findByIdAndUpdate( id, data, { new: true });

    res.json({
        msg: 'Categoria Actualizada',
        categoriaActualizada
    });
}

// borrarCategoria - estado: false

const borrarCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, {estado: false} );

    res.status(200).json({
        msg: 'Estado actualizado',
        categoria
    });

}

module.exports = {
    crearCategorias,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}