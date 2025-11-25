const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://felipe:${password}@clusterfelipeklingerdaw.q1htk.mongodb.net/?appName=ClusterFelipeKlingerDAW`;

mongoose.set("strictQuery", false); // strictQuery es una opción de Mongoose que controla cómo se manejan las consultas que contienen campos no definidos en el esquema. Al establecerlo en false, Mongoose permitirá consultas con campos no definidos sin lanzar un error.

mongoose.connect(url); // conecta a la base de datos

const noteSchema = new mongoose.Schema({
  // define el esquema de la colección
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema); // crea el modelo Note basado en el esquema noteSchema

const note = new Note({
  content: "Nueva nota de prueba",
  important: false,
});

note.save().then( result => {
  console.log('note saved!')
  console.log(result)
})
  
