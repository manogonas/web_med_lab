const db = require('../db')

class RequestController {
    async createRequest(req, res) {
		let {service, sex, name, surname, patronymic, number, address, email, date, extra } = req.body
        let price = ""
        let response
        let client_id
        if (patronymic) {
            client_id = await db.query('SELECT id FROM client WHERE sex = $1 AND name = $2 AND surname = $3 AND patronymic = $4 AND date = $5 AND (email = $6 OR number = $7)', [ sex, name, surname, patronymic, date, email, number ])
        }
        else {
            client_id = await db.query('SELECT id FROM client WHERE sex = $1 AND name = $2 AND surname = $3 AND date = $4 AND patronymic IS NULL AND (email = $5 OR number = $6)', [ sex, name, surname, date, email, number ])
        }
        if (client_id.rowCount === 0) {
            if (patronymic) {
                client_id = await db.query('INSERT INTO client (sex, name, surname, patronymic, number, address, email, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [ sex, name, surname, patronymic, number, address, email, date ])
            }
            else {
                client_id = await db.query('INSERT INTO client (sex, name, surname, number, address, email, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [ sex, name, surname, number, address, email, date ])
            }
        }
        client_id = client_id.rows[0].id
        extra = (extra === 'true')
        if (extra) {
            price = await db.query('SELECT extra_price AS price FROM service WHERE id = $1', [ service ])
        }
        else {
            price = await db.query('SELECT price FROM service WHERE id = $1', [ service ])
        }
        price = price.rows[0].price
        let request = await db.query('INSERT INTO request (service, client, status, extra, date, price) VALUES ($1, $2, 1, $3, CURRENT_DATE, $4) RETURNING service, client, status, extra, to_char(date,' +  "'DD.MM.YYYY'" + ') AS date, price', [service, client_id, extra, price])
        response = {
            success: true,
            res: request.rows[0]
        }
        res.json(response)
    }
    async getRequests(req, res) {
        let str = 'SELECT service.name AS service, client.name AS name, client.surname AS surname, client.patronymic AS patronymic, client.number AS number, status.name AS status, case when request.extra then ' + "'да'" +  ' else ' +  "'нет'" + ' end AS extra, to_char(request.date,' +  "'DD.MM.YYYY'" + ') AS date, request.price AS price FROM request JOIN service ON service.id = request.service JOIN client ON client.id = request.client JOIN status ON status.id = request.status ORDER BY request.date DESC'
		const requests = await db.query(str)
        let response = {
            success: true,
            res: requests.rows
        }
		res.json(response)
    }
}

module.exports = new RequestController()