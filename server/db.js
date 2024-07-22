const Pool = require('pg').Pool
const pool = new Pool({
	user: 'postgres',
	password: 'ZkrTUORtaWXp',
	host: 'localhost',
	port: 5432,
	database: 'medical'
})

module.exports = pool