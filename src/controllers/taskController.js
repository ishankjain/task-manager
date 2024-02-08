const tasks = require("../models/taskModel").tasks;
const DEFAULT_PRIORITY = require("../models/taskModel").DEFAULT_PRIORITY;

let taskId = Math.max(...tasks.map((task) => task.id)) + 1;

// Controller functions
const getTasks = (req, res) => {
  let filteredTasks = [...tasks];

  // Filter by completion status
  const { completed } = req.query;
  if (completed) {
    const isCompleted = completed === "true";
    filteredTasks = filteredTasks.filter(
      (task) => task.completed === isCompleted
    );
  }

  // Filter by priority
  const { priority } = req.query;
  if (priority) {
    filteredTasks = filteredTasks.filter((task) => task.priority === priority);
  }

  // Sort by id (proxy for creation date)
  const { sortBy } = req.query;
  if (sortBy) {
    const [field, order] = sortBy.split(":");
    filteredTasks.sort((a, b) => {
      if (order === "asc") {
        return a[field] - b[field];
      } else if (order === "desc") {
        return b[field] - a[field];
      }
    });
  }

  return res.status(200).json(filteredTasks);
};

const getTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  // Check if task exists
  if (taskIndex === -1) {
    return handleTaskNotFound(res);
  }

  return res.status(200).json(tasks[taskIndex]);
};

const createTask = (req, res) => {
  const { title, description, completed, priority } = req.body;

  // Create the task with default priority if not provided
  const task = {
    id: taskId++,
    title,
    description,
    completed,
    priority: priority || DEFAULT_PRIORITY,
  };
  tasks.push(task);

  return res.status(201).json(task);
};

const updateTask = (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  // Check if task exists
  if (taskIndex === -1) {
    return handleTaskNotFound(res);
  }

  const { title, description, completed, priority } = req.body;

  // Update the task.
  tasks[taskIndex].title = title;
  tasks[taskIndex].description = description;
  tasks[taskIndex].completed = completed;
  tasks[taskIndex].priority = priority || DEFAULT_PRIORITY;

  return res.status(200).json(tasks[taskIndex]);
};

const deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  // Check if task exists
  if (taskIndex === -1) {
    return handleTaskNotFound(res);
  }

  tasks.splice(taskIndex, 1);
  return res.sendStatus(200);
};

// Common error handling function
const handleTaskNotFound = (res) => {
  return res.status(404).json({ error: "Task not found" });
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
