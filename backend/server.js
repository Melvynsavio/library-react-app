const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookRoutes =
  require("./routes/books");

const memberRoutes =
  require("./routes/members");

const app = express();

const PORT = 3001;

const MONGO_URI =
  "mongodb://127.0.0.1:27017/library_management";

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Library Management API is running",
  });
});

app.use(
  "/api/books",
  bookRoutes
);

app.use(
  "/api/members",
  memberRoutes
);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });