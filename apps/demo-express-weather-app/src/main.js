import * as path from 'path'
import * as express from 'express'
import 'hbs'
import { allLocations, locationBySlug } from './locations';


const app = express()
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
  res.redirect('/seattle')
})

app.get('/:slug', (req, res) => {
  const slug = req.params['slug']
  const location = locationBySlug(slug)
  const locations = allLocations(slug)
  res.render( 'weather', {location,locations})
})

const port = process.env.port || 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
server.on('error', console.error)
