import connection from "../database/database.js";
import bcrypt from "bcrypt";
import { singupSchema } from "../schemas.js";

async function signUp(req, res) {
	const validation = singupSchema.validate(req.body);
	if (validation.error) {
		console.log(req.body);
		return res.sendStatus(400);
	}

	const { name, email, address, cpf, password } = req.body;

	try {
		const duplicateEmailCheck = await connection.query("SELECT * FROM users WHERE email = $1;", [
			req.body.email,
		]);

		const duplicateCpfCheck = await connection.query("SELECT * FROM users WHERE cpf = $1;", [cpf]);

		if (duplicateEmailCheck.rows.length !== 0 || duplicateCpfCheck.rows.length !== 0)
			return res.sendStatus(409);
		const passwordHash = bcrypt.hashSync(password, 10);
		console.log(passwordHash);

		await connection.query(
			`INSERT INTO users (name,email,address,cpf,password)
		                        VALUES ($1,$2,$3,$4,$5);`,
			[name, email, address, cpf, passwordHash]
		);

		return res.sendStatus(201);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

export default signUp;
