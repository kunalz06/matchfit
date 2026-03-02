const express = require("express");
const router = express.Router();
const db = require("../db");

// Track order by order_no
router.get("/track/:order_no", (req, res) => {
  const { order_no } = req.params;
  db.query(
    "SELECT orderNo, status FROM orders WHERE orderNo = ?",
    [order_no],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json({ message: "Order not found" });
      res.json(results[0]);
    }
  );
});

module.exports = router;
