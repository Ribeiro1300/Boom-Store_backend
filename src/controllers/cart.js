import connection from "../database/database.js";

async function postCart(req, res) {
	try {
		const userCheck = await connection.query("SELECT * FROM users WHERE id = $1;", [
			req.body?.user.id,
		]);
		const productCheck = await connection.query("SELECT * FROM products WHERE id = $1;", [
			req.bodu?.product.id,
		]);

		if (userCheck.rowCount === 0 || productCheck.rowCount === 0) return res.sendStatus(404);

		const userId = req.body.user.id;
		const productId = req.body.product.id;

		const cartCheck = await connection.query("SELECT * FROM carts WHERE userId = $1;", [userId]);
		let cartId;

		if (cartCheck.rows.length === 0) {
			cartId = (await connection.query("INSERT INTO carts (userId) VALUES ($1);", [userId])).rows[0]
				.id;
		} else {
			cartId = cartCheck.rows[0].id;
		}

		await connection.query("INSERT INTO cart_product (cartId,productId) VALUES ($1,$2);", [
			cartId,
			productId,
		]);

		const returnCart = await connection.query("SELECT * FROM carts WHERE userId = $1;", [userId]);

		return res.send(returnCart.rows[0]).status(200);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

export { postCart };
