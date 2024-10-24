const express = require('express');
const bcypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')
const jwt = require('jsonwebtoken');
const { ActualizarContraseña } = require('../helpers/actualizarContraseña');

const crearUsuario = async (req, res = express.response) => {
    const { Email, DisplayName, Contraseña } = req.body
    try {
        let usuario = await Usuario.findOne({ Email })
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con este correo ya existe. ',
            })
        }
        usuario = await Usuario.findOne({ DisplayName })
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con este DisplayName ya existe. ',
            })
        }


        usuario = new Usuario(req.body);
        const salt = bcypt.genSaltSync();
        usuario.Contraseña = bcypt.hashSync(Contraseña, salt);
        usuario.ultimaActualizacionDeContraseña = new Date(new Date + "UTC");
        usuario.FotoUrl = 'https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg';
        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.DisplayName)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            token,

        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador.',

        })
    }
}

const verificarNombreDeUsuario = async (req, res) => {
    const { DisplayName } = req.body
    try {

        let usuario = await Usuario.findOne({ DisplayName })
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese nombre de usuario'
            })

        } else {
            res.status(200).json({
                ok: true,
                msg: 'Existe usuario con ese nombre de usuario'
            })
        }
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: `Ocurrio un error buscando el usuario: ${error}`
        })
    }
}

const logearUsuario = async (req, res) => {


    const { DisplayName, Contraseña } = req.body
    try {
        let usuario = await Usuario.findOne({ DisplayName })
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con este displayName. ',
            })
        } else {
            console.log(usuario);
        }

        const validPassword = bcypt.compareSync(Contraseña, usuario.Contraseña);

        if (!validPassword) {

            res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        } else {
            const token = await generarJWT(usuario.id, usuario.DisplayName)


            res.json({
                ok: true,
                usuario: usuario,
                uid: usuario.id,
                token
            })
        }



    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al logear usuario. Por favor, intenta de nuevo más tarde.'
        });
    }
}
const renewToken = async (req, res) => {
    const { uid, displayName } = req.body;
    const token = await generarJWT(uid, displayName)

    res.json({
        ok: true,
        msg: 'Renew',
        nuevoToken: token
    })
}

const actualizarUsuario = async (req, res) => {


    const
        {
            DisplayName, Nombre, Apellido,
            Email, genero, fecha_nacimiento,
            numero_telefono, uid, Foto_de_perfil
        } = req.body;


    try {
        // Encuentra al usuario por su ID
        let usuario = await Usuario.findOne({ _id: uid });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        // Crea un objeto de actualización
        const updatedFields = {};

        if (DisplayName) updatedFields.DisplayName = DisplayName;
        if (Nombre) updatedFields.Nombre = Nombre;
        if (Apellido) updatedFields.Apellido = Apellido;
        if (Foto_de_perfil) updatedFields.FotoUrl = Foto_de_perfil;
        if (Email) updatedFields.Email = Email;
        if (genero) updatedFields.genero = genero;
        if (fecha_nacimiento) updatedFields.fecha_nacimiento = fecha_nacimiento;
        if (numero_telefono) updatedFields.numero_telefono = numero_telefono;


        usuario = await Usuario.findOneAndUpdate({ _id: uid }, updatedFields, { new: true });

        return res.json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            usuario,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al actualizar el usuario',
        });
    }
}


const CambiarContraseña = async (req, res) => {


    const
        {
            uid,
            Contraseña,
            ContraseñaAntigua
        } = req.body;


    try {
        // Encuentra al usuario por su ID
        let usuario = await Usuario.findOne({ _id: uid });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        const resp = await ActualizarContraseña(uid, ContraseñaAntigua, Contraseña);
        if (!resp.ok) {
            return res.status(401).json({

                ok: false,
                msg: 'La contraseña ingresada no es correcta',
            })

        }
        return res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada correctamente',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al actualizar la contraseña',
        });
    }
}

module.exports = {
    crearUsuario,
    logearUsuario,
    renewToken,
    actualizarUsuario,
    verificarNombreDeUsuario,
    CambiarContraseña
}