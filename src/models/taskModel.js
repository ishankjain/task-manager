const tasks = require("../../task.json").tasks;
const DEFAULT_PRIORITY = "medium";
const PRIORITY_LEVELS = ["low", "medium", "high"];

tasks.forEach((task) => {
  if (!task.priority) {
    task.priority = DEFAULT_PRIORITY;
  }
});

module.exports = { tasks, DEFAULT_PRIORITY, PRIORITY_LEVELS };
