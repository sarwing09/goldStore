// index.js
const express = require('express');
const { dbConection } = require('./utils/db/config');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
dbConection();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/store', require('./routes/routes'));
app.use('/stock', require('./routes/stock'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto', process.env.PORT);
});