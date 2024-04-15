import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
  users_list: [
    
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
  //Note: The "toFixed" rounds the generated number to 8 decimals, 
  // since the id was too many decimals originally to transfer across api
  return Math.random().toFixed(8); 
}

app.post("/users", (req, res) => { // If JSON format is incorrect, it doesn't post
  const userToAdd = req.body;
  if(findByNameAndJob(userToAdd.name, userToAdd.job) !== undefined) {
    res.status(400).end(); // User already exists. Technically, it might be a different user 
    // and so we could give them a new ID, which would make them unique, but I felt that in such 
    // a small scale application as this if the name & job are the same it's okay to just assume
    // that the people are the same, so don't add them again.
    return;
  }
  if(users["users_list"].length === MAX_USERS) {
    res.status(507).end() // Insufficient storage, probably could also do 504
    // Storage is a soft limit set by MAX_USERS, which is declared under users[]
    return;
  }

  userToAdd.id = generateID(); // Generate a random ID.
  const code = addUser(userToAdd);

  if(code === 201) res.status(201).send(userToAdd); // Return user
  else res.status(code).end(); // Do not return user
});

const removeUser = (id) => {
  if(findUserById(id) === undefined) {
    return 404;
  }
  users["users_list"] = users["users_list"].filter((user) => user.id != id);
  return 204;
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
