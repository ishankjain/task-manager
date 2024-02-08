const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

const validateQueryParams = require("../middlewares/validateQueryParams");
const validateTaskInput = require("../middlewares/validateTaskInput");

// GET all tasks
router.get("/", validateQueryParams, taskController.getTasks);

// GET a task by ID
router.get("/:id", taskController.getTaskById);

// POST a new task
router.post("/", validateTaskInput, taskController.createTask);

// PUT update a task by ID
router.put("/:id", validateTaskInput, taskController.updateTask);

// DELETE a task by ID
router.delete("/:id", taskController.deleteTask);

module.exports = router;
