import app from "./app.js";

app.listen(process.env.PORT || 4000, () => {
  console.log("Magic happening on port 4000");
});
