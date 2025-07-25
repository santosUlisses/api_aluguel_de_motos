require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conn = require('./db/db');
const Aluguel = require('./models/Aluguel')
const Moto = require('./models/Moto')
const Pagamentos = require('./models/Pagamentos')
const User = require('./models/User')
const relacionamento = require('./models/relacionamento')


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const router = require('./routers/router');
app.use('/', router);




conn.sync({ force: false }).then(() => { app.listen(3000) }).catch(error => console.log(error));