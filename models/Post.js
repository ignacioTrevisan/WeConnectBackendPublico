const { Schema, model } = require('mongoose');

const PostSchema = Schema({
    DisplayName: {
        type: String,
        require: true,
    },
    Uid: {
        type: String,
        require: true,
    },
    Fecha_de_post: {
        type: Date,
        require: true,
    },
    Cuerpo_de_post: {
        type: String,
        require: true,
    },
    Foto_de_usuario: {
        type: String,
        require: true,
    },
    Likes: {
        type: Array,
        require: true
    },
    Comentarios: {
        type: Array,
        require: false,
    },
    esComentario: {
        type: Boolean,
        require: true
    }

})

module.exports = model('Post', PostSchema);



