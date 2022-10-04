const express = require("express");
const cors = require("cors");
const app = express();
// set url
const url = 5000;
// CORS config 
app.use(cors());
// middleware
app.use(express.json())

const todoList = [];

app.get("/", (req, res) => {
  res.send("Server is working!");
});
app.post("/todos", (req, res) => {
//   console.log(req.body);
  todoList.push(req.body)
  res.status(200).end();
});
app.get('/todos', (req, res) => {
    res.json({todoList})
})


app.listen(url, () => {
  console.log(`Server started on port: ${url}`);
});
