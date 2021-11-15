import bcrypt from "bcrypt";
import connection from "../../src/database/database";

export async function createUser() {
	const user = {
		name: "Test User",
		email: "test@email.com",
		address: "rua das ostras 35",
		cpf: "77777777777",
		password: "123456",
	};

	const hashedPassword = bcrypt.hashSync(user.password, 10);

	const insertedUser = await connection.query(
		`INSERT INTO users (name, email,address, cpf, password) VALUES ($1, $2, $3,$4,$5) RETURNING *`,
		[user.name, user.email, user.address, user.cpf, hashedPassword]
	);

	user.id = insertedUser.rows[0].id;

	return user;
}
