const express = require('express');
const { dbConnection } = require('./database');
require('dotenv').config();
const port = process.env.PORT;
//Crear el servidor de express
const cors = require('cors');

const app = express();
app.use(cors());
app.use(cors({
    origin: '*'
}));
//



//Base de datos

dbConnection();

//Directorio public

app.use(express.static('public'))


//lectura y parse de el body

app.use(express.json());
//rutas

app.use('/api/auth', require('./routes/auth'));

app.use('/api/usuario', require('./routes/usuario'));

app.use('/api/post', require('./routes/post'));



//escuchar peticiones

app.listen(port, () => { console.log(`Servidor corriendo en el puerto ${port}`) });