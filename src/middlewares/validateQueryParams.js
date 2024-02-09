const PRIORITY_LEVELS = require("../models/taskModel").PRIORITY_LEVELS;

// Validate query parameters for filtering/sorting the tasks
const validateQueryParams = (req, res, next) => {
  // Validate for filtering by completion status
  const { completed } = req.query;
  if (completed && !["true", "false"].includes(completed)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid value for 'completed' parameter. Only allowed values are true and false.",
      });
  }

  // Validate for filtering by priority
  const { priority } = req.query;
  if (priority && !PRIORITY_LEVELS.includes(priority)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid value for 'priority' parameter. Only allowed values are low, medium and high.",
      });
  }

  // Validate for sorting by id (proxy for creation date)
  const { sortBy } = req.query;
  if (sortBy && !/^id:(asc|desc)$/.test(sortBy)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid value for 'sortBy' parameter. Only allowed values are id:asc and id:desc.",
      });
  }

  next();
};

module.exports = validateQueryParams;
