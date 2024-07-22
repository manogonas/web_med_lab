const Router = require('express')
const router = new Router()
const serviceController = require('../controllers/service.controller')

router.get('/services/:material/:lower_price/:upper_price/:lower_time/:upper_time', serviceController.getService)

module.exports = router