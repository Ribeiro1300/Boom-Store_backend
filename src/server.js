/* eslint-disable no-undef */
import app from "./app.js";
import "./setup.js";

app.listen(process.env.PORT, () => {
  console.log("Magic happening");
});
