// index.js inicia el servidor Express
const app = require('./app') // Importa la app de Express
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})