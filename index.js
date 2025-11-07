const express = require("express");
const app = express();

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) { //  note is not undefined 
    response.json(note);
  } else {
    response.status(404).end(); // status() sets the status code, end() ends the response
  }
});

app.delete("/api/notes/:id", (request, response) => { // APIREST significa que cada recurso tiene su propia URL
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id); // note.id diferente del id del request, filtra  y guarda los elementos que no coinciden
  response.status(204).end();
});

app.post("/api/notes", (resquest, response) => { // endpoint para crear nuevas notas
  const note = resquest.body; // el body del request contiene la nueva nota
  console.log(note);
  response.json(note);
});


const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
