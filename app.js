const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cors = require("cors");

const usersRouter = require("./routes/userRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const doctorsRouter = require("./routes/doctorRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const app = express();

console.log(process.env.NODE_ENV);
// 1) Global Middlewares

// Implementing cors
app.use(cors());

// set Security HTTP headers
app.use(helmet());

// Limit requests from same  API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in an hour"
});

// app.use("/api", limiter);

// Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: "10kb"
  })
);

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price"
    ]
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});

// 3) Routes

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/doctor", doctorsRouter);
app.use("/api/v1/booking", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
