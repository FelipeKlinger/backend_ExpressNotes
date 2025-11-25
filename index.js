const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
app.use(express.static("dist")); // middleware para servir archivos estaticos desde la carpeta build
const Note = require("./models/note"); // importa el modelo Note desde models/note.js
app.use(cors()); // middleware to enable CORS
app.use(express.json()); // middleware to parse JSON bodies

app.use(
  morgan(function (tokens, req, res) {
    // este tipo de funcion se llama en JS un callback

    morgan.token("body", (req) => JSON.stringify(req.body)); // token personalizado para mostrar el body de la peticion

    return [
      tokens.method(req, res), // Método HTTP
      tokens.url(req, res), // URL solicitada
      tokens.status(req, res), // Código de estado
      tokens.res(req, res, "content-length"),
      "-", // Tamaño de la respuesta
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res), // Cuerpo de la petición
    ].join(" ");
  })
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.send(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error); // pasa el error al siguiente middleware de manejo de errores
    });
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response, next) => {
  //request reperesenta la petición HTTP que se recibe en el servidor y el response representa la respuesta HTTP que se enviará al cliente
  const body = request.body; // el request body es el contenido enviado por el cliente en una petición HTTP POST

  const note = new Note({
    content: body.content, // crea una nueva nota con el contenido del body
    important: body.important || false, // si no viene important en el body, lo pone en false
  });

  note.save().then((savedNote) => {
    // guarda la nota en la base de datos
    response.json(savedNote); // response es el objeto que representa la respuesta HTTP que se enviará al cliente, rep
  }) .catch(error => next(error));
});

app.put("/api/notes/:id", (request, response, next) => {
  const {content, important} = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, {content, important}, {new: true, runValidators: true, context: "query"})
    .then((updateNote) => {
      response.json(updateNote);
    })
    .catch((error) => {
      next(error);
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint); // middleware para manejar endpoints desconocidos

const errorHandler = (error, request, response, next) => {
  // middleware para manejar errores
  console.error(error.message);

  if (error.name === "CastError") { // si el error se llmama CastError, retorna el error 404
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error); // si no es un CastError, pasa el error al siguiente middleware
};

app.use(errorHandler); // middleware para manejar errores

const PORT = process.env.PORT || 3001; // obtiene el puerto desde las variables de entorno o usa 3001 por defecto

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
