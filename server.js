const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db")

dotenv.config({ path: "./config/config.env" });
const app = express();

connectDB();

const hotel = require("./routes/hotels");
const PORT = process.env.PORT || 5000;
const auth = require("./routes/auth");
const bookings = require("./routes/bookings");
const reviews = require("./routes/reviews");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowsMs: 10*60*1000,
  max: 100
});
const hpp = require('hpp');
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());
app.use("/api/v1/hotels", hotel);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/reviews", reviews);

const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);
process.on(`unhandledRejection`, (err, promise) => {
  console.log(`Error ${err.message}`);
  server.close(() => process.exit(1));
});