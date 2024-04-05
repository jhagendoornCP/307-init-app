import React, { useState } from "react";
import Table from "./Table.jsx";
import Form from "./Form.jsx";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  function removeOneCharacter(index) {
    const updated = characters.filter((c, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }

  function updateList(person) {
    setCharacters([...characters, person]);
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
