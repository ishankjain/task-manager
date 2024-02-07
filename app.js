express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to validate task input
const validateTaskInput = (req, res, next) => {
  const { title, description, completed } = req.body;

  // Check if title, description, and completed are provided and are of correct types
  if (
    typeof title !== "string" || title.trim() === "" ||
    typeof description !== "string" || description.trim() === "" ||
    typeof completed !== "boolean"
  ) {
    return res
      .status(400)
      .json({
        error:
          "Title, description, and completed are required fields and must be of valid types. Title and description " +
          "should be strings and completed should be a boolean.",
      });
  }

  // If validation passes, move on to the next middleware
  next();
};

// Middleware to check if task exists by ID
const checkTaskExists = (req, res, next) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);

  // Check if task exists
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  // If task exists, attach it to the request object for use in subsequent middleware
  req.task = task;
  next();
};

// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace

  // Return an appropriate error response to the client
  return res.status(500).json({ error: "Internal Server Error" });
};

// Validate query parameters for filtering/sorting the tasks
const validateQueryParams = (req, res, next) => {
  // Validate for filtering by completion status
  const { completed } = req.query;
  if (completed && !["true", "false"].includes(completed)) {
    return res.status(400).json({ error: "Invalid value for 'completed' parameter. Only allowed values are true and false." });
  }

  // Validate for sorting by id (proxy for creation date)
  const { sortBy } = req.query;
  if (sortBy && !/^id:(asc|desc)$/.test(sortBy)) {
    return res.status(400).json({ error: "Invalid value for 'sortBy' parameter. Only allowed values are id:asc and id:desc." });
  }

  next();
};

let tasks = [];
let taskId = 1;

// Routes
app.get("/", (req, res) => {
  return res.status(200).send("Task Manager API");
});

// GET all tasks
app.get("/tasks", validateQueryParams, (req, res) => {
  let filteredTasks = [...tasks];

  // Filter by completion status
  const { completed } = req.query;
  if (completed) {
    const isCompleted = completed === "true";
    filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
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
});

// GET a task by ID
app.get("/tasks/:id", checkTaskExists, (req, res) => {
  return res.status(200).json(req.task);
});

// POST a new task
app.post("/tasks", validateTaskInput, (req, res) => {
  const { title, description, completed } = req.body;

  // Create the task
  const task = { id: taskId++, title, description, completed };
  tasks.push(task);

  return res.status(201).json(task);
});

// PUT update a task by ID
app.put("/tasks/:id", validateTaskInput, checkTaskExists, (req, res) => {
  const { title, description, completed } = req.body;

  // Update the task
  req.task.title = title;
  req.task.description = description;
  req.task.completed = completed;

  return res.status(201).json(req.task);
});

// DELETE a task by ID
app.delete("/tasks/:id", checkTaskExists, (req, res) => {
  const index = tasks.indexOf(req.task);
  tasks.splice(index, 1);

  return res.sendStatus(204);
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;