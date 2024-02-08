const PRIORITY_LEVELS = require("../models/taskModel").PRIORITY_LEVELS;

// Middleware to validate task input
const validateTaskInput = (req, res, next) => {
  const { title, description, completed, priority } = req.body;

  // Check if title, description, and completed are provided and are of correct types.
  // Also validate the optional parameter priority.
  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof description !== "string" ||
    description.trim() === "" ||
    typeof completed !== "boolean" ||
    (priority && !PRIORITY_LEVELS.includes(priority))
  ) {
    return res.status(400).json({
      error:
        "Title, description, and completed are required fields and must be of valid types. " +
        "Title and description should be strings, completed should be a boolean, and priority " +
        "should be one of 'low', 'medium', or 'high'.",
    });
  }

  // If validation passes, move on to the next middleware
  next();
};

module.exports = validateTaskInput;
