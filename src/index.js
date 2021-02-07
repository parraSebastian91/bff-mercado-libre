var router = require('express').Router()
const item = require('./routes/item')

router.use('/api/item', item)

router.get('/', function(req, res) {
    res.status(200).json({ message: 'Estás conectado a nuestra API' })
})

module.exports = router