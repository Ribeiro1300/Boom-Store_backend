import connection from "../../src/database/database.js";

export async function createSession(user) {
	const token = "valid_token";
	const userId = user.id;

	await connection.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [
		userId,
		token,
	]);

	return {
		token,
	};
}
