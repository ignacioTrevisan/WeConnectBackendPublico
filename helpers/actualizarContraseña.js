const bcypt = require('bcryptjs')
const Usuario = require('../models/Usuario');

const ActualizarContraseña = async (uid, contraseñaAntigua, nuevaContraseña) => {

    let usuario = await Usuario.findOne({ _id: uid })
    if (!usuario) {
        console.log('No se encontro el usuario');
        return;
    }
    const validPassword = bcypt.compareSync(contraseñaAntigua, usuario.Contraseña);

    if (!validPassword) {
        return {
            ok: false,
            msg: 'La contraseña ingresada no es correcta',
        }

    }
    const updatedFields = {};

    const salt = bcypt.genSaltSync();
    const ContraseñaConHash = bcypt.hashSync(nuevaContraseña, salt);
    updatedFields.Contraseña = ContraseñaConHash;
    const ahora = new Date();
    const fecha_actualizacion_de_contraseña = new Date(ahora.getTime() - (3 * 60 * 60 * 1000));
    updatedFields.Contraseña = ContraseñaConHash;
    updatedFields.ultimaActualizacionDeContraseña = fecha_actualizacion_de_contraseña;
    usuario = await Usuario.findOneAndUpdate({ _id: uid }, updatedFields, { new: true });
    return {
        ok: true,
        msg: 'Contraseña actualizada correctamente. '
    }


}
module.exports = {
    ActualizarContraseña
}