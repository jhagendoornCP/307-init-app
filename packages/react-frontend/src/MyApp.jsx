import React, { useState, useEffect } from "react";
import Table from "./Table.jsx";
import Form from "./Form.jsx";


function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(id) {
    deleteUser(id)
      .then((res) => {
        if(res.status === 204) {
          setCharacters([...characters.filter((user) => user.id != id)])
        } else console.log(res.status);
      })
      .catch((error) => console.log(error));
  }
  function updateList(person) {
    postUser(person)
      .then((res) => {
        if(res.status === 201){
          setCharacters([...characters, res.json()])
        } else console.log(res.status)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(person),
    });

    return promise;
  }
  function deleteUser(id) {
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      }, 
      body: "",
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json)=> setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
