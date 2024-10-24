const jwt = require('jsonwebtoken');

const Usuario = require('../models/Usuario');
const { response } = require('express')


const validarJWT = async (req, res, next) => {
    const { token, uid } = req.body;
    if (!token || !uid) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token o uid'
        })
    }
    try {
        const resp = await extraerInfoJWT(token);
        console.log(resp)
        if (resp.ok === false) {
            return res.status(401).json({
                ok: false,
                msg: 'Token invalido',
            })
        }
        const { payload } = resp;
        try {

            let usuario = await Usuario.findOne({ _id: uid })
            const fechaCreacionToken = new Date(payload.fecha_creacion_token).getTime();
            const fechaUltimaActualizacion = new Date(usuario.ultimaActualizacionDeContraseña).getTime();



            if (fechaCreacionToken > fechaUltimaActualizacion) {
                const { uid, displayName } = jwt.verify(token, process.env.SECRET_JWT_SEED);
                req.uid = uid;
                req.displayName = displayName;

                next();
            } else {

                return res.status(401).json({
                    ok: false,
                    msg: 'La contraseña se actualizo, por favor vuelva a ingresarla. ',
                    fechaCreacionToken,
                    fechaUltimaActualizacion
                })

            }
        } catch (error) {
            return res.status(401).json({
                ok: false,
                msg: 'Ocurrio un error con el id del usuario',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            payload
        })
    }


}


const extraerInfoJWT = (tokenActual) => {
    try {
        console.log(tokenActual);
        const payload = jwt.verify(tokenActual, process.env.SECRET_JWT_SEED);
        console.log('Token verificado con éxito'); // Cambié el mensaje para mayor claridad
        return {
            ok: true,
            payload
        };
    } catch (error) {
        console.error('Error al verificar el token:', error); // Mejor manejo de errores
        return {
            ok: false,
        };
    }
};

module.exports = {
    validarJWT
}