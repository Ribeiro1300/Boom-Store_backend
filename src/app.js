import express from "express";
import cors from "cors";
import signUp from "./controllers/sign-up.js";
import login from "./controllers/login.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	return res.sendStatus(200);
});

app.post("/login", login);

app.post("/signup", signUp);

export default app;
