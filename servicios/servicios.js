const axios = require('axios');

const getSerch = async (query) => {
    const search = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`)
        .then(response => {
            console.log(response.data);
            return search;
        })
        .catch(error => {
            console.log(error);
            return {};
        });
    return search;
}

export default getSerch