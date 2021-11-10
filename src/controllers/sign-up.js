import connection from "../database/database.js";
import bcrypt from "bcrypt";

async function signUp(req, res) {
	const { name, email, address, cpf, password } = req.body;

	try {
		const passwordHash = bcrypt.hash(password, 10);

		await connection.query(
			`INSERT INTO users 
                                (name,email,address,cpf,password) 
                                VALUES ($1,$2,$3,$4,$5)`,
			[name, email, address, cpf, passwordHash]
		);

		return res.sendStatus(201);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

export default signUp;
