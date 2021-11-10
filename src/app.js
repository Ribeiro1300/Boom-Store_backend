import express from "express";
import cors from "cors";
import signUp from "./controllers/sign-up.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
	return res.sendStatus(200);
});

app.post("/signup", signUp);

export default app;
