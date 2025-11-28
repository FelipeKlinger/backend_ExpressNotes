// utils/config.js este archivo gestiona la configuración de la aplicación con las variables de entorno

require("dotenv").config(); // carga las variables de entorno desde el archivo .env

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
