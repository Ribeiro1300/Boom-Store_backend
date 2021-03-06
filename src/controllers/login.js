import connection from "../database/database.js";
import { loginSchema } from "../schemas.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

async function login(req, res) {
	const validation = loginSchema.validate(req.body);
	if (validation.error) return res.sendStatus(400);

	const { email, password } = req.body;

	try {
		const emailCheck = await connection.query("SELECT * FROM users WHERE email = $1;", [email]);

		if (emailCheck.rows.length === 0) return res.sendStatus(401);

		const user = emailCheck.rows[0];
		if (!bcrypt.compareSync(password, user.password)) return res.sendStatus(401);

		const token = uuid();
		const session = await connection.query(`SELECT * FROM sessions WHERE "userId" = $1;`, [
			user.id,
		]);

		if (session.rows.length === 0) {
			await connection.query(`INSERT INTO sessions ("userId",token) VALUES ($1,$2);`, [
				user.id,
				token,
			]);
		} else {
			await connection.query(`UPDATE sessions SET token = $1 WHERE "userId" = $2;`, [
				token,
				user.id,
			]);
		}

		const userName = emailCheck.rows[0].name;
		const id = emailCheck.rows[0].id;
		return res.send({ userName, id, token }).status(200);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

export default login;
