const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Configure body-parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

// bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// middleware -
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized!" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`A Node Js API is listening on port: ${port}`);
});
