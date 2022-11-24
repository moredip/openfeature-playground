import * as path from 'path'
import * as express from 'express'
import 'hbs'


const app = express()
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.redirect('/seattle')
})

app.get('/:location', (req, res) => {
  const location = req.params['location']
  res.render( 'weather', {location})
})

const port = process.env.port || 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
server.on('error', console.error)
