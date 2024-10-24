const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    DisplayName: {
        type: String,
        require: true,
        unique: true
    },
    Nombre: {
        type: String,
        require: false,
    },
    Apellido: {
        type: String,
        require: false,
    },
    Contraseña: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        require: true,
        unique: true
    },
    genero: {
        type: String,
        require: false,
    },
    fecha_nacimiento: {
        type: Date,
        require: true,
    },
    fecha_creacion: {
        type: Date,
        require: true,
    },
    numero_telefono: {
        type: String,
        required: false,
        unique: false
    },
    FotoUrl: {
        type: String,
        required: false,

    },
    ultimaActualizacionDeContraseña: {
        type: Date,
        required: true
    }

})

module.exports = model('Usuario', UsuarioSchema);



