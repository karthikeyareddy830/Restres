const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { customerRoute, adminRoute } = require("../controllers/testController");

const router = express.Router();

/**
 * @route   GET /api/test/customer
 * @desc    Accessible by both customers and admins (any authenticated user)
 * @access  Private — role: customer | admin
 */
router.get(
  "/customer",
  authenticate,
  authorize("customer", "admin"),
  customerRoute
);

/**
 * @route   GET /api/test/admin
 * @desc    Accessible by admins only
 * @access  Private — role: admin
 */
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  adminRoute
);

module.exports = router;
