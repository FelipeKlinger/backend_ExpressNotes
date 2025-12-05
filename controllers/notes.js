// controllers/notes.js gestiona las rutas relacionadas con las notas
const notesRouter = require("express").Router(); // Crea un enrutador de Express
const Note = require("../models/note"); // Importa el modelo de Nota permite interactuar con la colección de notas en la base de datos

// GET /api/notes
notesRouter.get("/", async (request, response) => {
  // Async/Await para manejar operaciones asíncronas que requieren promesas
  const notes = await Note.find({}); // Busca todas las notas en la base de datos
  response.json(notes);
});

// GET /api/notes/:id
notesRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// POST /api/notes
notesRouter.post("/", async (request, response) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();
  response.status(201).json(savedNote);
});

// DELETE /api/notes/:id
notesRouter.delete("/:id", async (request, response) => {
  await Note.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

// PUT /api/notes/:id
notesRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
  });

  response.status(200).json(updatedNote);
});

module.exports = notesRouter;
