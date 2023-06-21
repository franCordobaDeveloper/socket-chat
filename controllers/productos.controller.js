const { response, request } = require("express");
const { Producto } = require("../models");





const obtenerProductos = async ( req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado : true };

    if( isNaN( desde ) ) {
        return res.status(401).json({
            msg: `El query: ${ query }, debe de ser un Numero.`
        });
    }

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        productos
    });
}


// Obtener producto Mediante ID
const obtenerProducto = async ( req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.status(200).json( producto );

}


const crearProducto = async ( req = request, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto: ${ productoDB.nombre }, ya existe en la DB`
        });
    }

    // Generar la data a guardad
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = await new Producto( data );

    // Guardad en DB
    await producto.save();

    res.status(200).json( producto );
}

// Actualizar Producto mediante ID
const actualizarProducto = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const productoActualizado = await Producto.findByIdAndUpdate( id, data, {new: true} );

    res.status(200).json({
        msg: 'Producto Actualizado',
        productoActualizado
    });

}


// Cambiar el estado del producto a { estado : false }
const eliminarProducto = async ( req = request, res = response ) => {

    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate( id, {estado: false}, { new: true } );

    res.status(200).json({
        msg: 'Estado actualizado',
        productoBorrado
    });


}







module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}