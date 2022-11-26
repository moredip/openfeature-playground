import * as path from 'path'
import * as express from 'express'
import 'hbs'
import { allLocations, getLocationInfo } from './lib/locations';
import { getTemperature, getConditions } from './lib/conditions';


const app = express()
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
  res.redirect('/seattle')
})

app.get('/:slug', (req, res) => {
  const slug = req.params['slug']
  const locations = allLocations(slug)

  const location = getLocationInfo(slug)
  const temperature = getTemperature(slug)
  const conditions = getConditions(slug)

  res.render( 'weather', {locations,location,temperature,conditions})
})

const port = process.env.port || 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
server.on('error', console.error)
