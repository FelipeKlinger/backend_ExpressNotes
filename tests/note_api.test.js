const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper"); //funciones auxiliares para los tests
const Note = require("../models/note");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  // Antes de cada test, limpiamos la base de datos y añadimos las notas iniciales
  await Note.deleteMany({}); // elimina todas las notas de la base de datos
  const noteObjects = helper.initialNotes.map((note) => new Note(note)); // crea instancias de Nota
  const promiseArray = noteObjects.map((note) => note.save()); // guarda cada nota en la base de datos
  await Promise.all(promiseArray); // espera a que todas las notas se guarden
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});
after(async () => {
  await mongoose.connection.close();
});

test("there are two notes", async () => {
  const response = await api.get("/api/notes");

  assert.strictEqual(response.body.length, helper.initialNotes.length);
});
after(async () => {
  await mongoose.connection.close();
});

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");

  const contents = response.body.map((e) => e.content);
  assert(contents.includes("HTML is easy"));
});
after(async () => {
  await mongoose.connection.close();
});

test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: false,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await helper.notesInDb();
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

  const contents = notesAtEnd.map((e) => e.content);
  assert(contents.includes("async/await simplifies making async calls"));
});
after(async () => {
  await mongoose.connection.close();
});

test("note without content is not added", async () => {
  const newNote = {
    important: true,
  };
  await api.post("/api/notes").send(newNote).expect(400);
  const notesAtEnd = await helper.notesInDb(); // sustituye con la función auxiliar al response api.get("/api/notes")
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
});
after(async () => {
  mongoose.connection.close();
});

test("a specific note can be viewed", async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.deepStrictEqual(resultNote.body, noteToView);
});
after(async () => {
  await mongoose.connection.close();
});

test("a note can be deleted", async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDele = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDele.id}`).expect(204);
  const notesAtEnd = await helper.notesInDb();
  const contents = notesAtEnd.map((r) => r.content);
  assert(!contents.includes(noteToDele.content));
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
});
after(async () => {
  await mongoose.connection.close();
});
