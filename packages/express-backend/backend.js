import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => { // If JSON format is incorrect, it doesn't post
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

const removeUser = (id) => {
  if(!findUserById(id)) {
    return 404;
  }
  users["users_list"] = users["users_list"].filter((user) => user.id != id);
  return 200;
}

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; 
  res.status(removeUser(id)).end()
})

const findByNameAndJob = (name, job) => users["users_list"].filter((user) => user.name === name && user.job === job)

app.get("/users/:name/:job", (req, res) => {
  const name = req.params["name"]
  const job = req.params["job"]
  let result = findByNameAndJob(name, job);
  if(result === undefined || result.length === 0) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
