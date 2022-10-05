const express = require("express");
const cors = require("cors");
const app = express();
// set port
const port = process.env.PORT || 5000
// CORS config 
app.use(cors());
// middleware
app.use(express.json())

// todo storage
const todoList = [];

app.get("/", (req, res) => {
    res.send("Server is working!");
});

// add new todo
app.post("/todos", (req, res) => {
    //   console.log(req.body);
    todoList.push(req.body)
    res.status(200).end();
});

// fetching todos on component render/update
app.get('/todos', (req, res) => {
    res.json({ todoList });
})

// deleting todos
app.delete("/todos/:todoId", (req, res) => {
    const todoId = req.params.todoId;
    const todoItemIndex = todoList.findIndex((e) => e.id === todoId);

    if (todoItemIndex !== undefined) {
        todoList.splice(todoItemIndex, 1)
    } else {
        res.status(404).end();
    }

    res.status(200).end();
})

// delete all todos
app.delete("/todos", (req, res) => {
    todoList.splice(0, todoList.length);
    res.status(200).end();
})

// update todos
app.patch("/todos/:todoId", (req, res) => {
    const todoId = req.params.todoId;

    const todoItem = todoList.find((e) => e.id === todoId)

    if (todoItem !== undefined) {
        const update = req.body;
        if (update.check !== undefined) {
            todoItem.check = update.check;
        }
        if (update.body !== undefined) {
            todoItem.body = update.body;
        }
        res.status(200).end();
    } else {
        res.status(404).end();
    }
    // here i am updating only one task... maybe i should return whole new todolist with updated task ?
})

app.listen(port, () => {
    console.log(`🚀 Server started on port: ${port}`);
});
