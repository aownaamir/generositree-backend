// basic idea
// module.exports = (err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const status = err.status || "error";
//   res.status(statusCode).json({ status, message: err.message });
// };
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  //   res.status(statusCode).json({ status, message: err.message });
  process.env.NODE_ENV === "development"
    ? sendErrorDev(err, res)
    : sendErrorProd(err, res);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
