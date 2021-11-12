import { produtos } from "../database/Data.js";

async function getProducts(req, res) {
  res.status(201).send(produtos);
}

export { getProducts };
