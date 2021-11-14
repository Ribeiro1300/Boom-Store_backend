import connection from "../database/database.js";

async function getProducts(req, res) {
  try {
    const result = await connection.query("SELECT * FROM product;");
    res.status(201).send(result.rows);
  } catch (error) {
    console.log("Algo deu errado!");
  }
}

async function getSingleProduct(req, res) {
  try {
    const { id } = req.params;
    const result = await connection.query("SELECT * FROM product WHERE id = $1;", [id]);
    res.status(201).send(result.rows);
  } catch (error) {
    console.log("Algo deu errado!");
  }
}

export { getProducts, getSingleProduct };
