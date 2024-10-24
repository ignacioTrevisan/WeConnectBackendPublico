const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const router = Router();


const { buscarUsuario, traerTodos, buscarUsuariosPorDisplayNames } = require('../controllers/usuario')
router.post(
    '/buscar',
    [
        check('uid', 'El Uid es obligatorio').notEmpty(),
        validarCampos
    ], buscarUsuario


)

router.get(
    '/traerTodos',
    [
        validarCampos
    ], traerTodos


)

router.get(
    '/buscarUsuariosPorDisplayNames',
    [
        validarCampos
    ], buscarUsuariosPorDisplayNames


)





module.exports = router;