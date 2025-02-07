const express = require("express");
const cors = require("cors");
const donationRouter = require("./routes/donationRoutes");
const morgan = require("morgan");
const errorController = require("./controllers/errorController");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/donations", donationRouter);
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.status = "fail";
  next(err);
});
app.use(errorController);

module.exports = app;
