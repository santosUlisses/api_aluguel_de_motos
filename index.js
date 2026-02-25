require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conn = require('./src/shared/db/db');
const relacionamento = require('./models/relacionamento')


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const router = require('./src/routers/router');
app.use('/', router);




conn.sync({ force: false }).then(() => { app.listen(3000) }).catch(error => console.log(error));