export async function createSession(user) {
	const token = "valid_token";

	await connection.query(`INSERT INTO sessions (userId, token) VALUES ($1, $2)`, [user.id, token]);

	return {
		token,
	};
}
