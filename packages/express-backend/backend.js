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
const MAX_USERS = 10; // Limit max number of users to 10

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
  try {
    users["users_list"].push(user);
    return 201;
  } catch(error) {
    console.log(`Error when adding user; ${error}`)
    return 500;
  }
};

const generateID = () => {
  return Math.random(); // just returns random ID atm
}

app.post("/users", (req, res) => { // If JSON format is incorrect, it doesn't post
  const userToAdd = req.body;
  if(findByNameAndJob(userToAdd) !== undefined) {
    res.status(400).end(); // User already exists. Technically, it might be a different user 
    // and so we could give them a new ID, which would make them unique, but I felt that in such 
    // a small scale application as this if the name & job are the same it's okay to just assume
    // that the people are the same, so don't add them again.
  }
  if(users["users_list"].length === MAX_USERS) {
    return 507; // Insufficient storage, probably could also do 504
    // Storage is a soft limit set by MAX_USERS, which is declared under users[]
  }

  userToAdd.id = generateID(); // Generate a random ID.
  const code = addUser(userToAdd);

  if(code === 201) res.status(201).send(userToAdd); // Return user
  else res.status(code).end(); // Do not return user
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

const findByNameAndJob = (name, job) => users["users_list"].find((user) => user.name === name && user.job === job)

app.get("/users/:name/:job", (req, res) => {
  const name = req.params["name"]
  const job = req.params["job"]
  let result = findByNameAndJob(name, job);
  if(result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
