const db = require('../db')
const md5 = require('md5')
const pidCrypt = require('pidcrypt')
require('pidcrypt/aes_cbc')

const aes = new pidCrypt.AES.CBC()
const cryptoKey = 'd8280afd41fa82cefa392da6a6343effa7a010e1910a1808e539bae7ab3875a6' //случайно сгенерированный ключ шифрования

class AuthController {
	async checkSession(req, res) {
		const sessionCookie = req.cookies['APP_SESSION']
		const userName = aes.decryptText(sessionCookie, cryptoKey)
		const result = await db.query('SELECT id, login, name, staff.surname FROM staff WHERE staff.login = $1', [userName])
		if (result.rows[0]) {
			res.json({
				success: true,
				userInfo: {
					id: result.rows[0].id,
					login: result.rows[0].login,
					name: result.rows[0].name,
                    surname: result.rows[0].surname
				}
			})
		} else {
			res.json({
				success: false
			})
		}
	}
	async login(req, res) {
		const userRecord = req.body
		const result = await db.query('SELECT id, login FROM staff WHERE staff.login = $1 AND staff.password = $2', [userRecord.login, md5(userRecord.password)])
		let response
		if (result.rows[0]) {
				res.cookie('APP_SESSION', aes.encryptText(userRecord.login, cryptoKey), {
				httpOnly: true
			})
			response = {
				success: true,
				userInfo: {
					id: result.rows[0].id,
					login: result.rows[0].login
				}
			}
		} else {
			response = { success: false }
		}
		res.json(response)
	}
	async register(req, res) {
		const userRecord = req.body
		const checkResult1 = await db.query('SELECT * FROM staff WHERE login = $1', [userRecord.login])
        const checkResult2 = await db.query("SELECT * FROM staff WHERE id = $1 AND login = '0' AND surname = $2", [userRecord.id, userRecord.surname])
		let response
		if ((!checkResult1.rows[0]) && (checkResult2.rows[0])) {
			await db.query('UPDATE staff SET login = $1, password = $2 WHERE id = $3', [userRecord.login, md5(userRecord.password), userRecord.id])
			const result = await db.query('SELECT id, login, surname FROM staff WHERE login = $1', [userRecord.login])
			res.cookie('APP_SESSION', aes.encryptText(userRecord.login, cryptoKey), {
				httpOnly: true
			})
			response = {
				success: true,
				userInfo: {
					id: result.rows[0].id,
					login: result.rows[0].login,
					surname: result.rows[0].surname
				}
			}
		} else {
			response = { success: false }
		}
		res.json(response)
	}
	async logout(req, res) {
		res.clearCookie('APP_SESSION')
		res.json({ success: true })
	}
}

module.exports = new AuthController()