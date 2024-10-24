const express = require('express');
const bcypt = require('bcryptjs')
const Usuario = require('../models/Usuario');

const buscarUsuario = async (req, res = express.response) => {
    const { uid } = req.body
    try {
        let usuario = await Usuario.findOne({ _id: uid })
        if (usuario) {
            res.status(200).json({
                ok: true,
                usuario: usuario
            })
        } else {
            res.status(404).json({
                ok: false,
                msg: `No se ha encontrado el usuario con uid ${uid}`
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: `ha ocurrido un error inesperado, por favor, hable con el administrador. `
        })
    }
}
const traerTodos = async (req, res = express.response) => {
    try {
        let usuario = await Usuario.find()
        if (usuario) {
            return res.status(200).json({
                ok: true,
                data: usuario.map((u) => u.DisplayName)
            })
        } else {
            return res.status(404).json({
                ok: true,
                msg: 'No se encontraron usuarios. '
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok: true,
            msg: `ocurrio un error indefinido al buscar todos los usuario: ${error}`
        })
    }
}

const buscarUsuariosPorDisplayNames = async (req, res = express.response) => {
    const { DisplayName } = req.query;
    try {
        let usuario = await Usuario.findOne({ DisplayName: { $regex: new RegExp(`^${DisplayName}$`, 'i') } });
        if (usuario) {
            res.status(200).json({
                ok: true,
                data: usuario
            })
        } else {
            res.status(404).json({
                ok: false,
                msg: `No se ha encontrado el usuario con el displayName ${DisplayName}`
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: `ha ocurrido un error inesperado, por favor, hable con el administrador. `
        })
    }
}

module.exports = {
    buscarUsuario,
    traerTodos,
    buscarUsuariosPorDisplayNames
}