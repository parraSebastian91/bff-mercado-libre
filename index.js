const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;





/**
 * Prueba de servicio
 */
app.get('/', (req, res) => {
    res.send('prueba request')
})

/**
 * Busqueda de item por query string
 */
app.get('/api/item', (req, res) => {
    const query = req.query.q;
    // const respuesta = getSerch(query);

    axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`)
        .then(res => {
            // console.log(res.data);
            res.send(JSON.stringify(res))
        })
        .catch(error => {
            // console.log(error);
            res.send({})
        });
    
})

app.listen(port, () => {
    console.log(`Servidor de escucha en http://localhost:${port}`)
})
