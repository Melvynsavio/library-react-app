const express = require("express");

const router = express.Router();

const {
  getLogs,
} = require("../logger");

// GET ACTIVITY LOG
router.get("/", (req, res) => {
  try {
    const logs = getLogs();

    res.json({
      success: true,
      logs: logs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to read logs",
      error: error.message,
    });
  }
});

module.exports = router;