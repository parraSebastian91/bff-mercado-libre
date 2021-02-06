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
app.get('/api/item', async(req, res) => {
    const query = req.query.q;
    const reqURL = `https://api.mercadolibre.com/sites/MLA/search?q=${query}`;
    const resultadoBusqueda = await axios.get(reqURL)
        .then(response => {
            const responseFormateado = {
                author: {
                    name: 'sebastian',
                    lastname: 'parra'
                },
                categories: [
                    'Categoria 1',
                    'Categoria 2',
                ],
                items: []
            }
            responseFormateado.items = response.data.results.slice(1, 5).map(m => {
                return {
                    id: m.id,
                    title: m.title,
                    price: {
                        currency: m.currency_id,
                        amount: m.price,
                        decimals: 0
                    },
                    picture: m.thumbnail,
                    condition: m.attributes.find(f => f.id === 'ITEM_CONDITION').value_name,
                    free_shipping: m.shipping.free_shipping
                }

            });
            res.send(responseFormateado)
        })
        .catch(error => {
            console.log(error);
            res.send(JSON.parse(error))
        });

})

app.get('/api/item/:id', async(req, res) => {
    const idItem = req.params.id;
    const itemURL = `https://api.mercadolibre.com/items/${idItem}`;
    const itemDescriptionURL = `https://api.mercadolibre.com/items/${idItem}/description`;
    axios.all([
            axios.get(itemURL),
            axios.get(itemDescriptionURL)
        ])
        .then(axios.spread((itemResponse, descResponse) => {
            console.log()
            respItem = itemResponse.data;
            respDesc = descResponse.data;
            console.log(respDesc)
            const responseFormateado = {
                id: idItem,
                title: respItem.title,
                price: {
                    currency: respItem.currency_id,
                    amount: respItem.price,
                    decimals: 0
                },
                picture: respItem.pictures[0].url,
                condition: respItem.attributes.find(f => f.id === 'ITEM_CONDITION').value_name,
                free_shipping: respItem.shipping.free_shipping,
                sold_quantity: respItem.sold_quantity,
                description: respDesc.plain_text
            }
            res.send(responseFormateado)

        }))
})

app.listen(port, () => {
    console.log(`Servidor de escucha en http://localhost:${port}`)
})