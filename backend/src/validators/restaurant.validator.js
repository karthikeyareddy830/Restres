const { body } = require("express-validator");

const createRestaurantValidator = [
  body("name").trim().notEmpty().withMessage("Restaurant name is required"),
  body("address.street").trim().notEmpty().withMessage("Street is required"),
  body("address.city").trim().notEmpty().withMessage("City is required"),
  body("address.state").trim().notEmpty().withMessage("State is required"),
  body("address.zip").trim().notEmpty().withMessage("ZIP code is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
];

const updateRestaurantValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
];

module.exports = { createRestaurantValidator, updateRestaurantValidator };
