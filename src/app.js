import express from "express";
import cors from "cors";
import { getProducts } from "./controllers/products.js";
import signUp from "./controllers/sign-up.js";
import login from "./controllers/login.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/products",getProducts)
app.get("/", (req, res) => {
	return res.sendStatus(200);
});

app.post("/login", login);

app.post("/signup", signUp);

export default app;
