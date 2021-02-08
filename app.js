const env = require('node-env-file'); // .env file
const express = require('express') //llamamos a Express
const app = express()
const routes = require('./src/index')
env(__dirname + '/.env');

var port = process.env.PORT || 5000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

app.use('', routes);



app.listen(port, () => {
    console.log(`Servidor de escucha en http://localhost:${port}`)
})