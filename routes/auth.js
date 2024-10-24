const { Router } = require('express');
const { check } = require('express-validator')


const router = Router();

const { crearUsuario, logearUsuario, renewToken, actualizarUsuario, verificarNombreDeUsuario, CambiarContraseña } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');


router.post
    ('/register',
        [
            check('DisplayName', 'El DisplayName es obligatorio').notEmpty(),
            check('DisplayName', 'El DisplayName debe tener un minimo de 4 caracteres').isLength({ min: 4 }),
            check('Email', 'El email es obligatorio').notEmpty(),
            check('Email', 'El email no tiene el formato correcto').isEmail(),
            check('Contraseña', 'La contraseña es obligatoria').notEmpty(),
            check('Contraseña', 'La contraseña es debe tener un minimo de 6 caracteres y maximo de 18').isLength({ min: 6, max: 18 }),

            validarCampos
        ],
        crearUsuario)

router.post(
    '/login',
    [
        check('DisplayName', 'El DisplayName es obligatorio').notEmpty(),
        check('Contraseña', 'La contraseña es obligatoria').notEmpty(),
        check('Contraseña', 'La contraseña es debe tener un minimo de 6 caracteres y maximo de 18').isLength({ min: 6, max: 18 }),
        validarCampos
    ], logearUsuario


)

router.post(
    '/verificarDisplayname',
    [
        check('DisplayName', 'El DisplayName es obligatorio').notEmpty(),
        validarCampos
    ], verificarNombreDeUsuario


)






router.post('/renew', validarJWT, renewToken)


router.put('/update', [
    check('uid', 'Falta el uid').notEmpty(),


    validarCampos
], actualizarUsuario)



router.put('/updatePassword', [
    check('ContraseñaAntigua', 'Falta la contraseña antigua').notEmpty(),
    check('uid', 'Falta el uid').notEmpty(),
    check('Contraseña', 'Falta la nueva contraseña').notEmpty(),
    check('ContraseñaAntigua', 'La Contraseña antigua es debe tener un minimo de 6 caracteres y maximo de 18').isLength({ min: 6, max: 18 }),
    check('Contraseña', 'La contraseña es debe tener un minimo de 6 caracteres y maximo de 18').isLength({ min: 6, max: 18 }),
    validarCampos
], CambiarContraseña)



module.exports = router;