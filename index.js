const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri)
  .then(() => console.log("GenerosiDB connected!"))
  .catch((err) => console.log("Error while connecting to GenerosiDB: ", err));

const server = app.listen(3000, () => {
  console.log("GeerotiTree started!");
});
