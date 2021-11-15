/* eslint-disable no-undef */
import "./setup.js";
import app from "./app.js";

app.listen(process.env.PORT, () => {
	console.log("Server running on port " + process.env.PORT);
	console.log("database url " + process.env.DATABASE_URL);
});
