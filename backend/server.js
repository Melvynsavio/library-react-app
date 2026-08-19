require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookRoutes =
  require("./routes/books");

const memberRoutes =
  require("./routes/members");

const issueRoutes =
  require("./routes/issues");

const returnRoutes =
  require("./routes/returns");

const userRoutes =
  require("./routes/users");

const logRoutes =
  require("./routes/logs");

const app = express();

const PORT = Number(process.env.PORT) || 3001;

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/library_management";

const configuredOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;

  try {
    const url = new URL(origin);
    return (
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname) &&
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  })
);

app.use(express.json({ limit: "100kb" }));

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

app.use(
  "/api/issues",
  issueRoutes
);

app.use(
  "/api/returns",
  returnRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/logs",
  logRoutes
);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Request body must contain valid JSON",
    });
  }

  if (res.headersSent) {
    return next(error);
  }

  console.error("UNHANDLED API ERROR:", error);
  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred",
  });
});

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
