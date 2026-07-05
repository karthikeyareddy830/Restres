const asyncHandler = require("../utils/asyncHandler");
const restaurantService = require("../services/restaurant.service");

/**
 * Restaurant Controller — Maps HTTP requests to service calls.
 * All business logic lives in restaurant.service.js.
 */

// POST /api/restaurants
const createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.createRestaurant(req.body, req.user._id);
  res.status(201).json({ success: true, message: "Restaurant created successfully", data: restaurant });
});

// GET /api/restaurants
const getAllRestaurants = asyncHandler(async (req, res) => {
  const result = await restaurantService.getAllRestaurants(req.query);
  res.status(200).json({ success: true, ...result });
});

// GET /api/restaurants/:id
const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.id);
  res.status(200).json({ success: true, data: restaurant });
});

// PUT /api/restaurants/:id
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.updateRestaurant(req.params.id, req.body);
  res.status(200).json({ success: true, message: "Restaurant updated successfully", data: restaurant });
});

// DELETE /api/restaurants/:id
const deleteRestaurant = asyncHandler(async (req, res) => {
  await restaurantService.deleteRestaurant(req.params.id);
  res.status(200).json({ success: true, message: "Restaurant deactivated successfully" });
});

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
