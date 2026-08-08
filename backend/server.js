const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ==========================================
// ROUTES
// ==========================================

const bookRoutes = require("./routes/books");
const memberRoutes = require("./routes/members");
const userRoutes = require("./routes/users");
const issueRoutes = require("./routes/issues");
const returnRoutes = require("./routes/returns");
const logRoutes = require("./routes/logs");

// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// CONFIGURATION
// ==========================================

const PORT = 3001;

const MONGO_URI =
  "mongodb://127.0.0.1:27017/library_management";

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Library Management API is running",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/books",
  bookRoutes
);

app.use(
  "/api/members",
  memberRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/issues",
  issueRoutes
);

app.use(
  "/api/returns",
  returnRoutes
);

app.use(
  "/api/logs",
  logRoutes
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// ==========================================
// MONGODB CONNECTION
// ==========================================

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
      "MongoDB connection failed:"
    );

    console.error(error.message);
  });