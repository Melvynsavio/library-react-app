const fs = require("fs");
const path = require("path");

// Location of the log folder
const logDirectory = path.join(
  __dirname,
  "logs"
);

// Location of the log file
const logFile = path.join(
  logDirectory,
  "library-activity.log"
);

// Create logs folder if it doesn't exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, {
    recursive: true,
  });
}

// Function to write activity
function logActivity(action, details) {
  const date = new Date().toLocaleString();

  const logMessage =
    `[${date}] ${action} - ${details}\n`;

  fs.appendFile(
    logFile,
    logMessage,
    (error) => {
      if (error) {
        console.error(
          "Failed to write log:",
          error
        );
      }
    }
  );
}

// Function to read all logs
function getLogs() {
  try {
    if (!fs.existsSync(logFile)) {
      return "";
    }

    return fs.readFileSync(
      logFile,
      "utf8"
    );
  } catch (error) {
    console.error(
      "Failed to read log:",
      error
    );

    return "";
  }
}

module.exports = {
  logActivity,
  getLogs,
};