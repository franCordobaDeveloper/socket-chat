const { Router } = require('express'); 
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { crearCategorias, obtenerCategorias, obtenerCategoria, borrarCategoria, actualizarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();


// Obtener todas las categorias - publico
router.get('/', obtenerCategorias );


// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria );


// Crear categoria - privado - cualquier persona con un token valido
router.post('/',  [ 
    validarJWT,
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    validarCampos

], crearCategorias);


// Actualizar categoria por id - privado cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], actualizarCategoria);


// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], borrarCategoria );



module.exports = router;