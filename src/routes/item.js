var router = require('express').Router()
const axios = require('axios');

/**
 * Prueba de servicio
 */
router.get('/test', (req, res) => {
    res.send('prueba request item')
})

/**
 * Busqueda de item por query string
 */
router.get('', async(req, res) => {
    const query = req.query.q;
    const reqURL = `https://api.mercadolibre.com/sites/MLA/search?q=${query}`;
    const resultadoBusqueda = await axios.get(reqURL)
        .then(response => {
            const categorias = response.data.available_filters.find(f => f.id == 'category')
            const responseFormateado = {
                author: {
                    name: 'sebastian',
                    lastname: 'parra'
                },
                categories: ((categorias) ? categorias.values.slice(0, 5).map(m => {
                    return m.name
                }) : response.data.filters.find(f => f.id == 'category').values[0].path_from_root.slice(0, 5).map(m => {
                    return m.name
                })),
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
            res.set('Content-Type', 'application/json')
            res.send(responseFormateado)
        })
        .catch(error => {
            console.log(error);
            res.send(JSON.parse(error))
        });

})



router.get('/:id', async(req, res) => {
    const idItem = req.params.id;
    const itemURL = `https://api.mercadolibre.com/items/${idItem}`;
    const itemDescriptionURL = `https://api.mercadolibre.com/items/${idItem}/description`;
    axios.all([
            axios.get(itemURL),
            axios.get(itemDescriptionURL)
        ])
        .then(axios.spread((itemResponse, descResponse) => {
            respItem = itemResponse.data;
            respDesc = descResponse.data;
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
            res.send(responseFormateado);

        }))
        .catch(err => {
            res.send({ cod: 500, msj: 'error' });
            res.s
        })
});

module.exports = router