import * as path from 'path'

import * as express from 'express'
import { MinimalistProvider } from '@moredip/openfeature-minimalist-provider'
import { OpenFeature } from '@openfeature/js-sdk'
import * as hbs from 'hbs'

import routes from './routes';

const PORT = process.env.port || 3333

const app = express()

// configure feature flags
const provider = new MinimalistProvider({'show-umbrella-prediction':false})
OpenFeature.setProvider(provider)

// setup handlebars for view templating
hbs.registerHelper('available', function available(value) {
  return value !== null && value !== undefined;
});
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))

// setup serving of static assets (e.g. css)
app.use(express.static(path.join(__dirname, 'assets')))

// setup routes
app.use(routes)

// start the server
const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
server.on('error', console.error)
