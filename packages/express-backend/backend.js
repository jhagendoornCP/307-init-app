import express from "express";
import cors from "cors";
import {addUser, getUsers, findUserById, deleteUser } from "./models/user-services";

const app = express();
const port = 8000;

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  getUsers(name, job).then((result) => {
    if(result) res.send(result);
    else res.status(404).send(`Not found: ${name ? (job ? name + ", " + job : name) : job ? job : ''}`)
  }).catch((error) => {
    res.status(500).send(error.name);
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  findUserById(id).then((result) => {
    if (result) res.send(result);
    else res.status(404).send(`Not Found: ${id}`);
  }).catch((error) => {
    res.status(500).send(error.name);
  })
});

app.post("/users", (req, res) => { // If JSON format is incorrect, it doesn't post
  const userToAdd = req.body;
  addUser(userToAdd).then((result) => {
    res.status(result.status).send(result);
  }).catch((error) => {
    res.status(500).send(error.name);
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; 
  deleteUser(id).then((result) => {
    if(result) res.send(result);
    else res.status(404).send(`Not found: ${id}`);
  }).catch((error) => {
    res.status(500).send(error.name);
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
