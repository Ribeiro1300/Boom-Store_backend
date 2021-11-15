/* eslint-disable no-undef */
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

dotenv.config({
	path: envFile,
});
