const db = require('../db')

class resultController {
	async getResults(req, res) {
		const number = req.params.number
		const surname = req.params.surname
		const date = req.params.date
		let results
		let response
		results = await db.query('SELECT result.id as id, service.name as service, parameter.name as parameter, norm.norm as norm, result.result as result, measurement.measure as measure FROM result JOIN request ON request.id = result.request JOIN norm ON norm.id = result.norm JOIN service ON service.id = request.service JOIN parameter ON parameter.id = norm.parameter JOIN measurement ON measurement.id = parameter.measure JOIN client ON client.id = request.client WHERE request IN (SELECT request FROM list_of_requests WHERE agreement = $1) AND client.surname = $2 AND client.date = $3 ORDER BY service;', [ number, surname, date ])
		if (results.rows[0]) {
			response = {
				success: true,
				res: results.rows
			}
		}
		else {
			response = { success: false }
		}
		res.json(response)
	}
}

module.exports = new resultController()