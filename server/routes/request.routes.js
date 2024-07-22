const Router = require('express')
const router = new Router()
const requestController = require('../controllers/request.controller')

router.post('/request', requestController.createRequest)
router.get('/requests', requestController.getRequests)

module.exports = router