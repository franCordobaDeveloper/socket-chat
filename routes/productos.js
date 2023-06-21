const { Router } = require('express'); 
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos.controller');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();


// Obtener todas los productos - publico 
router.get('/', obtenerProductos );


// Obtener un producto por id - publico 
router.get('/:id', [
    check('id', 'No es un ID de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );


// Crear Producto - privado - cualquier persona con un token valido ('ADMIN_ROLE')
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto )


// Actualizar Producto por ID - privado - cualquier persona con un token valido ('ADMIN_ROLE')
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], actualizarProducto );


// Borrar un producto por id - ADMIN 
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom( existeProductoPorId ),
    validarCampos,
], eliminarProducto );




module.exports = router;