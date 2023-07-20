const AppError = require("../utils/appError");

const duplicateFieldsMongooseError = err => {
  const values = Object.keys(err.keyValue).map(el => el);
  let message;
  if(values.length > 1) {
    message = `User with provided fields: ${values.join(" and ")} is already reqistered in database. Please use different credentials.`
  } else {
    message = `User with provided ${values[0]} is already registered in database. Please use another one.`;
  }

  return new AppError(message, 400);
};

const validationMongooseError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid data. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const handleJWTExpiration = () => new AppError("Your session has expired. You need to log in again", 401);
const handleJWTInvalid = () => new AppError("Invalid token. Please log in again", 401);

const sendDevErrors = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message
  });
};

const sendProdErrors = (err, req, res) => {
  console.log(err);
  if(err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  return res.status(err.statusCode || 500).json({
    status: "error",
    message: "Something went wrong. Try again"
  });
};

module.exports = (err, req, res, next) => {
  console.log(err)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if(process.env.NODE_ENV === "development") {
    sendDevErrors(err, req, res);
  } else if(process.env.NODE_ENV === "production") {
    let error = {...err};
    error.message = err.message;

    if(err.code === 11000) error = duplicateFieldsMongooseError(error);
    if(err.name === "ValidationError") error = validationMongooseError(error);
    if(err.name === "JsonWebTokenError") error = handleJWTInvalid();
    if(err.name === "TokenExpiredError") error = handleJWTExpiration();

    sendProdErrors(error, req, res);
  }
};