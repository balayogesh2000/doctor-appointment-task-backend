const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  // Remove password from  output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.mobile) {
    const newUser = await User.create({
      name: req.body.name,
      mobile: req.body.mobile,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role
    });
    createSendToken(newUser, 201, res);
  } else {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role
    });
    createSendToken(newUser, 201, res);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password, mobile } = req.body;

  if (mobile) {
    // 1) Check if email and password received from client
    if (!mobile || !password) {
      return next(new AppError("Please provide mobile and password", 400));
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ mobile }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect Email or password", 401));
    }
    // 3) Sign in and send jwt to client
    createSendToken(user, 200, res);
  } else {
    // 1) Check if email and password received from client
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect Email or password", 401));
    }
    // 3) Sign in and send jwt to client
    createSendToken(user, 200, res);
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to continue", 401)
    );
  }
  // 2) Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findOne({ _id: decoded.id });
  if (!currentUser)
    return next(
      new AppError("The user belonging to this token no longer exist.", 401)
    );

  // 4) Check if user changed the password after the token was issued
  const isPasswordChanged = currentUser.passwordChangedAfter(decoded.iat);
  if (isPasswordChanged) {
    return next(
      new AppError("User recently changed password! Please login again.", 401)
    );
  }

  req.user = currentUser;
  // Grant access to protected route
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
