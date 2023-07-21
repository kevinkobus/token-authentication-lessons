const express = require("express");
const todoRouter = express.Router();
const Todo = require("../models/Todo.js");

// Get All Todos
todoRouter.get("/", (req, res, next) => {
  Todo.find({})
    .then((todos) => {
      return res.status(200).send(todos);
    })
    .catch((err) => {
      res.status(500);
      return next(err);
    });
});

// Add new Todo
todoRouter.post("/", (req, res, next) => {
  req.body.user = req.auth._id;
  const newTodo = new Todo(req.body);
  newTodo
    .save()
    .then((savedTodo) => {
      return res.status(201).send(savedTodo);
    })
    .catch((err) => {
      res.status(500);
      return next(err);
    });
});

// Delete Todo
todoRouter.delete("/:todoId", (req, res, next) => {
  Todo.findOneAndDelete({ _id: req.params.todoId, user: req.auth._id })
    .then((deletedTodo) => {
      if (!deletedTodo) {
        return res.status(404).send("Todo not found");
      }
      return res
        .status(200)
        .send(
          `Successfully deleted todo: ${deletedTodo.title} from the database`
        );
    })
    .catch((err) => {
      res.status(500);
      return next(err);
    });
});

// Update Todo
todoRouter.put("/:todoId", (req, res, next) => {
  Todo.findOneAndUpdate(
    { _id: req.params.todoId, user: req.auth._id },
    req.body,
    { new: true }
  )
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).send("Todo not found");
      }
      return res.status(200).send(updatedTodo);
    })
    .catch((err) => {
      res.status(500);
      return next(err);
    });
});

// Get todos by user id
todoRouter.get("/user", (req, res, next) => {
  Todo.find({ user: req.auth._id })
    .then((foundTodos) => {
      if (!foundTodos) {
        return res.status(404).send("Todo not found");
      }
      return res.status(200).send(foundTodos);
    })
    .catch((err) => {
      res.status(500);
      return next(err);
    });
});
module.exports = todoRouter;
