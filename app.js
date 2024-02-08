express = require("express");
const app = express();
const port = 3000;
const taskRoutes = require("./src/routes/taskRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  return res.status(200).send("Task Manager API");
});

// Use task routes
app.use("/tasks", taskRoutes);

// Custom error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace

  // Return an appropriate error response to the client
  return res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
