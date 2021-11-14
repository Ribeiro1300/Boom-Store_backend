import connection from "../database/database.js";

async function getProducts(req, res) {
  const result = await connection.query("SELECT * FROM product;");
  res.status(201).send(result.rows);
}

export { getProducts };
