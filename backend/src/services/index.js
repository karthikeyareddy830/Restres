/**
 * services/index.js
 *
 * Services contain the core business logic of the application.
 * Controllers call services; services call models (repositories).
 *
 * This separation ensures:
 * - Controllers stay thin (only handle HTTP layer)
 * - Business rules are testable in isolation (no HTTP dependency)
 * - Logic is reusable across multiple controllers or scheduled jobs
 *
 * Example services (to be added with each feature):
 *   services/
 *   ├── auth.service.js          → login, register, token refresh
 *   ├── reservation.service.js   → availability check, booking logic
 *   ├── restaurant.service.js    → CRUD, capacity management
 *   └── notification.service.js  → email/SMS confirmation logic
 */

// Placeholder — services will be added with each feature module
module.exports = {};
