import express, { json, urlencoded } from "express";
const app = express();
const port = 3000;

app.use(json());
app.use(urlencoded({ extended: true }));

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

let tasks = [];
let taskId = 1;

// Routes
app.get("/", (req, res) => {
  return res.status(200).send("Task Manager API");
});

// GET all tasks
app.get("/tasks", (req, res) => {
  return res.status(200).json(tasks);
});

// GET a task by ID
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);

  // Check if task exists
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.status(200).json(task);
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
app.put("/tasks/:id", validateTaskInput, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  const taskIndex = tasks.findIndex((task) => task.id === id);

  // Check if task exists
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Update the task
  tasks[taskIndex] = { id, title, description, completed };

  return res.status(201).json(tasks[taskIndex]);
});

// DELETE a task by ID
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  // Check if task exists
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);

  return res.sendStatus(204);
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

export default app;