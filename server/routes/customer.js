const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require('util');

// Promisify db.query
const dbQuery = util.promisify(db.query).bind(db);

// Track order by order_no
router.get("/track/:order_no", async (req, res) => {
  const { order_no } = req.params;
  try {
    const results = await dbQuery(
      "SELECT orderNo, status FROM orders WHERE orderNo = ?",
      [order_no]
    );
    if (results.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
