const express = require("express");
const cors = require("cors");
const donationRouter = require("./routes/donationRoutes");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/donations", donationRouter);

module.exports = app;
