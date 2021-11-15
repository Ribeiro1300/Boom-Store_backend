import connection from "../database/database.js";
import { loginSchema } from "../schemas.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

async function login(req, res) {
	const validation = loginSchema.validate(req.body);
	if (validation.error) return res.sendStatus(400);

	const { email, password } = req.body;

	try {
		const emailCheck = await connection.query("SELECT * FROM users WHERE email = $1", [email]);
		if (emailCheck.rows.length === 0) return res.sendStatus(401);

		const user = emailCheck.rows[0];
		if (!bcrypt.compareSync(password, user.password)) return res.sendStatus(401);

		let token;

		const session = await connection.query("SELECT * FROM sessions WHERE userid = $1", [user.id]);
		if (session.rows.length === 0) {
			token = uuid();
			await connection.query(`INSERT INTO sessions (userid,token) VALUES ($1,$2)`, [
				user.id,
				token,
			]);
		} else {
			token = uuid();
			await connection.query("UPDATE sessions SET token = $1 WHERE userid = $2", [token, user.id]);
		}
		return res.send({ token }).status(200);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

export default login;
