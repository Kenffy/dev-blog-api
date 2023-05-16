const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const functions = require("firebase-functions");
const { connectDB } = require("./utils/dbConfig");

const homeRoute = require("../src/routes/index");
const authRoutes = require("../src/routes/auth");
const userRoutes = require("../src/routes/users");
const articleRoutes = require("../src/routes/articles");
const commentRoutes = require("../src/routes/comments");

const app = express();
dotenv.config();
app.use(cors());

let SERVER_PORT = 5000;
if (process.env.NODE_ENV === "development") {
  SERVER_PORT = process.env.DEV_PORT;
} else {
  SERVER_PORT = process.env.PROD_PORT;
}

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

// routes
app.use("/", homeRoute);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

app.listen(SERVER_PORT, () => {
  connectDB();
  console.log("Server is listening on port: " + SERVER_PORT);
});

exports.devblog = functions.https.onRequest(app);
