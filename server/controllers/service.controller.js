const db = require('../db')

class ServiceController {
	async getService(req, res) {
		const material = req.params.material
		const lower_price = req.params.lower_price
		const upper_price = req.params.upper_price
		const lower_time = req.params.lower_time
		const upper_time = req.params.upper_time
		let where_set = false
		let str = "SELECT service.id, service.name AS name, biomaterial.name AS material, deadline.time AS deadline, service.time, service.extra_time, service.price, service.extra_price, service.description, service.recommendations FROM service JOIN biomaterial ON biomaterial.id = service.material JOIN deadline ON deadline.id = service.time_measure"
		if (material !== "-1") {
			str = str + " WHERE service.material = " + material
			where_set = true
		}
		if (lower_price !== "-1") {
			if (where_set) {
				str = str + " AND (service.price >= " + lower_price + " OR service.extra_price >= " + lower_price+ ")"
			}
			else {
				str = str + " WHERE (service.price >= " + lower_price + " OR service.extra_price >= " + lower_price+ ")"
				where_set = true
			}
		}
		if (upper_price !== "-1") {
			if (where_set) {
				str = str + " AND service.price <= " + upper_price
			}
			else {
				str = str + " WHERE service.price <= " + upper_price
				where_set = true
			}
		}
		if (lower_time !== "-1") {
			if (where_set) {
				str = str + " AND (service.extra_time >= " + lower_time + " OR service.time >= " + lower_time + ")"
			}
			else {
				str = str + " WHERE (service.extra_time >= " + lower_time + " OR service.time >= " + lower_time + ")"
				where_set = true
			}
		}
		if (upper_time !== "-1") {
			if (where_set) {
				str = str + " AND service.time <= " + upper_time
			}
			else {
				str = str + " WHERE service.time <= " + upper_time
				where_set = true
			}
		}
		const services = await db.query(str)
		res.json(services.rows)
	}
}

module.exports = new ServiceController()