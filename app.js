if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// The unified, clean database connection
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/urban-gems";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected successfully!");
});

// App is initialized here
const app = express();

// Parse incoming data
app.use(express.urlencoded({ extended: true }));
// CRITICAL FIX: Required so Express can read the JSON data sent by Next.js
app.use(express.json());
app.use(methodOverride("_method"));

// Security middleware
app.use(mongoSanitize({ replaceWith: "_" }));
app.use(helmet({ contentSecurityPolicy: false }));

// Initialize Passport for Authentication
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- API ROUTES ---
const apiAuth = require("./routes/api/auth");
const apiPlaces = require("./routes/api/places");

app.use("/api", apiAuth);
app.use("/api/places", apiPlaces);
// Note: Your reviews routes are now perfectly integrated inside apiPlaces!
// -------------------------------------------------------

// 404 Handler for API
app.all("*", (req, res, next) => {
  next(new ExpressError("API Endpoint Not Found", 404));
});

// The Error Handler (Now sends pure JSON instead of trying to render EJS HTML!)
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";

  // THIS LOG WILL CATCH ANY FUTURE BUGS:
  console.log("🚨 SERVER ERROR 🚨", err);

  res.status(statusCode).json({ error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
