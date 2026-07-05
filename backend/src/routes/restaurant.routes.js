const express = require("express");
const restaurantController = require("../controllers/restaurantController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../validators/validate");
const { createRestaurantValidator, updateRestaurantValidator } = require("../validators/restaurant.validator");

// Merge params so table routes can access :restaurantId
const router = express.Router({ mergeParams: true });

/**
 * @route   GET  /api/restaurants          → list all (public)
 * @route   POST /api/restaurants          → create (admin only)
 */
router
  .route("/")
  .get(restaurantController.getAllRestaurants)
  .post(
    authenticate,
    authorize("admin"),
    createRestaurantValidator,
    validate,
    restaurantController.createRestaurant
  );

/**
 * @route   GET    /api/restaurants/:id    → get one (public)
 * @route   PUT    /api/restaurants/:id    → update (admin only)
 * @route   DELETE /api/restaurants/:id    → soft-delete (admin only)
 */
router
  .route("/:id")
  .get(restaurantController.getRestaurant)
  .put(
    authenticate,
    authorize("admin"),
    updateRestaurantValidator,
    validate,
    restaurantController.updateRestaurant
  )
  .delete(authenticate, authorize("admin"), restaurantController.deleteRestaurant);

module.exports = router;
