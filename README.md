# Task Manager API

## Overview

The Task Manager API is a RESTful API built using Node.js and Express.js for managing tasks. It allows users to perform CRUD operations (Create, Read, Update, Delete) on tasks, including features such as filtering, sorting, and prioritizing tasks.

## Schema
Each task in the Task Manager API has the following schema:
```
{
  "id": Integer, (Unique identifier for the task)
  "title": String, (Title of the task)
  "description": String, (Description of the task)
  "completed": Boolean, (Indicates whether the task is completed (true) or not (false))
  "priority": String (Priority level of the task (low, medium, or high). Optional parameter with a default value of medium)
}
```

## Endpoints
### GET /tasks
Retrieve all tasks. Supports filtering and sorting.

#### Query Parameters
- completed: Filter tasks by completion status. Allowed values: true, false.
- priority: Filter tasks by priority level. Allowed values: low, medium, high.
- sortBy: Sort tasks by creation date. Allowed values: id:asc, id:desc.

### GET /tasks/:id
Retrieve a single task by its ID.

### POST /tasks
Create a new task.

### PUT /tasks/:id
Update an existing task by its ID.

### DELETE /tasks/:id
Delete a task by its ID.
