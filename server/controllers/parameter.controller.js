const db = require('../db')

class ParametersController {
	async getParams(req, res) {
        const service = req.params.service
		const parameters = await db.query('SELECT parameter.name AS name FROM parameter JOIN measurement ON measurement.id = parameter.measure JOIN list_of_parameters ON parameter.id = list_of_parameters.parameter WHERE list_of_parameters.service = $1', [service])
		res.json(parameters.rows)
	}
}

module.exports = new ParametersController()