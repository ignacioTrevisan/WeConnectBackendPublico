const express = require('express');
const Usuario = require('../models/Usuario');
const Post = require('../models/Post');
const { ObjectId } = require('mongoose').Types;

const SubirPost = async (req, res = express.response) => {
    const { Cuerpo_de_post, DisplayName, fecha_de_post, uid, esComentario } = req.body
    try {
        let usuario = await Usuario.findOne({ DisplayName });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: `No se encontro ningun usuario con el displayName de: ${DisplayName}`,
            })
        }

        const NuevoPost = {
            DisplayName: usuario.DisplayName,
            Uid: uid,
            Fecha_de_post: new Date(new Date + "UTC"),
            Cuerpo_de_post: Cuerpo_de_post,
            Foto_de_usuario: usuario.FotoUrl,
            Likes: [],
            Comentarios: [],
            esComentario
        }
        post = new Post(NuevoPost);
        await post.save();

        res.status(200).json({
            ok: true,
            msg: 'Post subido correctamente. ',
            data: post._id
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador.',

        })
    }
}

const traerTodosLosPost = async (req, res = express.response) => {
    try {
        let posts = await Post.find({});


        for (let p of posts) {

            let u = await Usuario.findOne({ _id: p.Uid });

            if (u) {
                p.DisplayName = u.DisplayName;
                p.FotoUrl = u.FotoUrl;
                p.Foto_de_usuario = u.FotoUrl;
            }
        }

        if (posts) {
            res.status(200).json({
                ok: true,
                posts: posts
            })
        } else {
            res.status(404).json({
                ok: false,
                msg: `No se ha encontrado ningun post. `
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

const traerPorId = async (req, res = express.response) => {
    const { postId } = req.query;
    try {
        let post = await Post.findOne({ _id: postId });
        let usuario = await Usuario.findOne({ _id: post.Uid })
        post.DisplayName = usuario.DisplayName;
        post.Foto_de_usuario = usuario.FotoUrl;
        if (post) {
            res.status(200).json({
                ok: true,
                post: post
            })
        } else {
            res.status(404).json({
                ok: false,
                msg: `No se ha encontrado ningun post. `
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


const traerPorUsuario = async (req, res = express.response) => {
    const { idUsuario } = req.query;
    try {
        let post = await Post.find({ Uid: idUsuario });
        let postArray = post.filter((p) => p.esComentario === false)
        let usuario = await Usuario.findOne({ _id: postArray[0].Uid })
        postArray.map((p) => p.DisplayName = usuario.DisplayName);
        postArray.Foto_de_usuario = usuario.FotoUrl;
        if (postArray) {
            res.status(200).json({
                ok: true,
                data: postArray
            })
        } else {
            res.status(404).json({
                ok: false,
                msg: `No se ha encontrado ningun post. `
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: `ha ocurrido un error inesperado, por favor, hable con el administrador. ${error}`
        })
    }
}



const darLikeAPost = async (req, res = express.response) => {
    const { uid, idPost } = req.body
    try {
        let posts = await Post.find({ _id: idPost });
        let post = posts[0]
        const tieneNuestroLike = post.Likes.includes(uid)
        let msg;
        if (!tieneNuestroLike) {
            post.Likes.push(uid);
            msg = 'agregado';
        } else {
            post.Likes = post.Likes.filter(item => item !== uid);
            msg = 'eliminado';


        }
        await post.save();
        return res.status(200).json({
            ok: true,
            msg: `Likes ${msg} correctamente`
        })


    } catch (error) {
        console.log(error)
    }
}

const comentarPost = async (req, res = express.response) => {
    const { idPost, idComentario } = req.body
    try {
        let posts = await Post.findOne({ _id: idPost });

        let nuevoComentario = await Post.findOne({ _id: idComentario });

        if (!posts) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el post a comentar',
            });
        }
        if (posts.Comentarios.includes(idComentario)) {
            return res.status(400).json({
                ok: false,
                msg: 'Este comentario ya existe',
            })
        }

        if (!nuevoComentario) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el comentario a agregar',
            });
        }


        const updatedFields = {};
        let comentarios = posts.Comentarios;
        comentarios.push(idComentario);
        updatedFields.Comentarios = comentarios;

        usuario = await Post.findOneAndUpdate({ _id: idPost }, updatedFields, { new: true });
        return res.json({
            ok: true,
            msg: 'Comentario agregado correctamente',
            usuario,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al agregar el comentario',
        });
    }
}

const editarPost = async (req, res = express.response) => {
    try {
        const { idPost, uid, bodyPost } = req.body
        let post = await Post.findOne({ _id: idPost });
        if (!post) {
            return res.status(404).json({
                ok: false,
                msg: 'Post no encontrado'
            })
        }
        if (post.Uid !== uid) {
            return res.status(203).json({
                ok: false,
                msg: `No estas autorizado para modificar este post ${post.Uid} + ${uid}`
            })
        }
        const updatedFields = {};

        if (bodyPost) updatedFields.Cuerpo_de_post = bodyPost;

        post = await Post.findOneAndUpdate({ _id: idPost }, updatedFields, { new: true });

        return res.json({
            ok: true,
            msg: 'Post actualizado correctamente',
            post,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `error del servidor, por favor hable con el administrador`
        })
    }
}

const borrarPost = async (req, res = express.response) => {
    try {
        const { idPost, uid } = req.query;
        if (!idPost || !uid) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró idPost ni uid en los parametros'
            })
        }
        let post = await Post.findOne({ _id: idPost })
        if (!post) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró el post que se intenta borrar.'
            })
        }
        if (post.Uid !== uid) {
            return res.status(401).json({
                ok: false,
                msg: `No poseé permisos para eliminar este post. `,
            })
        }
        await Post.findByIdAndDelete(idPost);
        return res.status(200).json({
            ok: true,
            msg: 'Post eliminado correctamente. '
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: error
        })
    }

}

module.exports = {
    SubirPost,
    traerTodosLosPost,
    darLikeAPost,
    traerPorId,
    comentarPost,
    traerPorUsuario,
    editarPost,
    borrarPost
}