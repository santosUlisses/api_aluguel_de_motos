require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conn = require('./src/shared/db/db');
const relacionamento = require('./src/models/relacionamento')


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const router = require('./src/routers/router');
app.use('/', router);




conn.sync({ force: false }).then(() => { app.listen(process.env.PORT) }).catch(error => console.log(error));