const Router = require('express')
const router = new Router()
const resultController = require('../controllers/result.controller')

router.get('/results/:number/:surname/:date', resultController.getResults)

module.exports = router