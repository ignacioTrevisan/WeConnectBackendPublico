const mongoose = require('mongoose');


const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log('Db online');

    } catch (error) {
        console.log(error);
        throw new Error("Error al inicializar bdd");

    }
}

module.exports = {
    dbConnection
}