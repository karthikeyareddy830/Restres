const Restaurant = require("../models/Restaurant.model");
const ApiError = require("../utils/ApiError");

/**
 * Restaurant Service — All business logic for restaurant CRUD.
 * Zero Express knowledge; fully unit-testable.
 */

// ─── Create ───────────────────────────────────────────────────────────────────
const createRestaurant = async (data, adminId) => {
  const restaurant = await Restaurant.create({ ...data, managedBy: adminId });
  return restaurant;
};

// ─── Get All (active only, with pagination + city filter) ─────────────────────
const getAllRestaurants = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    city,
    cuisine,
    search,
  } = query;

  const filter = { isActive: true };

  if (city) filter["address.city"] = new RegExp(city, "i");
  if (cuisine) filter.cuisine = { $in: [new RegExp(cuisine, "i")] };
  if (search) filter.name = new RegExp(search, "i");

  const skip = (Number(page) - 1) * Number(limit);

  const [restaurants, total] = await Promise.all([
    Restaurant.find(filter)
      .select("-managedBy -__v")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Restaurant.countDocuments(filter),
  ]);

  return {
    restaurants,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

// ─── Get One ──────────────────────────────────────────────────────────────────
const getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findById(id).populate("tables");
  if (!restaurant) throw new ApiError(404, "Restaurant not found.");
  return restaurant;
};

// ─── Update ───────────────────────────────────────────────────────────────────
const updateRestaurant = async (id, data) => {
  const restaurant = await Restaurant.findByIdAndUpdate(id, data, {
    new: true,           // Return the updated document
    runValidators: true, // Re-run schema validators on update
  });
  if (!restaurant) throw new ApiError(404, "Restaurant not found.");
  return restaurant;
};

// ─── Delete (soft-delete via isActive flag) ───────────────────────────────────
const deleteRestaurant = async (id) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!restaurant) throw new ApiError(404, "Restaurant not found.");
  return restaurant;
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
