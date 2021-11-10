import express from "express";
import cors from "cors";
import signUp from "./controllers/sign-up.js";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", signUp);

export default app;
