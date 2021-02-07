const env = require('node-env-file'); // .env file
const express = require('express') //llamamos a Express
const app = express()
const routes = require('./src/index')
env(__dirname + '/.env');

var port = process.env.PORT || 5000;

app.use('', routes);

app.listen(port, () => {
    console.log(`Servidor de escucha en http://localhost:${port}`)
})