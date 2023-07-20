const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

exports.protect = async(req, res, next) => {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new AppError("Your token seems to be invalid. Try logging in again", 400));
  }

  if(!token) {
    return next(new AppError("Your token seems to be invalid. Try logging in again", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.userId);

  if(!currentUser) {
    return next(new AppError("Your token seems to be invalid or has expired. Try logging in again", 401));
  }

  req.user = currentUser;
  next();
};