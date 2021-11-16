import connection from "../database/database.js";

async function queryCartProducts(cartId) {
	const cart = await connection.query(
		`SELECT p.id, p.name, p.img, p.price 
		 FROM product AS p 
		 JOIN cart_products ON cart_products."productId" = p.id	
		 WHERE cart_products."cartId" = $1;`,
		[cartId]
	);

	return cart.rows;
}

async function queryUserIdByToken(token) {
	const user = await connection.query(
		`SELECT sessions."userId" 
		FROM sessions JOIN users ON users.id = sessions."userId"
		WHERE sessions.token = $1;`,
		[token]
	);

	return user.rows[0].userId;
}

async function getCartProducts(req, res) {
	try {
		const authorization = req.headers["authorization"];
		const token = authorization?.split("Bearer ")[1];
		const userId = await queryUserIdByToken(token);
		if (userId.rowCount === 0) return res.sendStatus(404);

		const cartCheck = await connection.query(`SELECT * FROM carts WHERE "userId" = $1;`, [userId]);
		let cartId;
		let products;

		if (cartCheck.rows.length === 0) {
			cartId = (
				await connection.query(`INSERT INTO carts ("userId") VALUES ($1) RETURNING *;`, [userId])
			).rows[0].id;
			products = await queryCartProducts(cartId);
			return res.send({ cartId, products }).status(201);
		}

		cartId = cartCheck.rows[0].id;
		products = await queryCartProducts(cartId);
		return res.send({ cartId, products }).status(200);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

async function addProductToCard(req, res) {
	try {
		const authorization = req.headers["authorization"];
		const token = authorization?.split("Bearer ")[1];
		const userId = await queryUserIdByToken(token);
		if (userId.rowCount === 0) return res.sendStatus(404);

		const productCheck = await connection.query("SELECT * FROM product WHERE id = $1;", [
			req.body?.product.id,
		]);
		if (productCheck.rowCount === 0) return res.sendStatus(404);

		const productId = req.body.product.id;

		const cartCheck = await connection.query(`SELECT * FROM carts WHERE "userId" = $1;`, [userId]);
		let cartId;

		if (cartCheck.rows.length === 0) {
			cartId = (
				await connection.query(`INSERT INTO carts ("userId") VALUES ($1) RETURNING *;`, [userId])
			).rows[0].id;
		} else {
			cartId = cartCheck.rows[0].id;
			const duplicateProductCheck = await connection.query(
				`SELECT * FROM cart_products AS cp WHERE cp."cartId" = $1 AND cp."productId" = $2;`,
				[cartId, productId]
			);
			if (duplicateProductCheck.rows.length !== 0) return res.sendStatus(409);
		}

		await connection.query(`INSERT INTO cart_products ("cartId","productId") VALUES ($1,$2);`, [
			cartId,
			productId,
		]);

		const returnCart = await connection.query(`SELECT * FROM carts WHERE "userId" = $1;`, [userId]);

		return res.send(returnCart.rows[0]).status(200);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

export { addProductToCard, getCartProducts };
