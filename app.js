// app.js configura la aplicación Express, conecta a la base de datos y define el middleware y las rutas
const config = require("./utils/config");
const express = require("express");
const app = express(); // crea una aplicación de Express que
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter); // Usa el enrutador de notas para las rutas que comienzan con /api/notes
app.use("/api/users", usersRouter); // usa el enrutador de users para las rutas que comienzan con /api/users

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
