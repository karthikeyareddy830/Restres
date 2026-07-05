/**
 * asyncHandler — Higher-order function to eliminate repetitive try-catch blocks
 * in async Express route handlers and middleware.
 *
 * Wraps an async function and forwards any rejected promise (thrown error)
 * directly to Express's next() error handler pipeline.
 *
 * @param {Function} fn - An async Express route handler
 * @returns {Function}  - A standard Express middleware function
 *
 * @example
 *   // Without asyncHandler (verbose):
 *   router.get("/", async (req, res, next) => {
 *     try {
 *       const data = await SomeService.getAll();
 *       res.json(data);
 *     } catch (err) {
 *       next(err);
 *     }
 *   });
 *
 *   // With asyncHandler (clean):
 *   router.get("/", asyncHandler(async (req, res) => {
 *     const data = await SomeService.getAll();
 *     res.json(data);
 *   }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
