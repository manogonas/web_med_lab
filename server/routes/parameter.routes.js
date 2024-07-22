const Router = require('express')
const router = new Router()
const parametersController = require('../controllers/parameter.controller')

router.get('/parameters/:service', parametersController.getParams)

module.exports = router