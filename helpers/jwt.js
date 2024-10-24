const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const generarJWT = async (usuario) => {
    try {
        const ahora = new Date();
        const fecha_creacion_token = new Date(ahora.getTime() - (3 * 60 * 60 * 1000)); // Resta 3 horas para obtener UTC-3
        const payload = { usuario, fecha_creacion_token };
        if (!process.env.SECRET_JWT_SEED) {
            throw new Error('La clave secreta para JWT no está definida');
        }

        const token = await promisify(jwt.sign)(payload, process.env.SECRET_JWT_SEED, { expiresIn: '3d' });

        return token;
    } catch (error) {
        console.error('Error al generar el JWT:', error);
        throw new Error('No se pudo generar el token');
    }
};

module.exports = {
    generarJWT
};