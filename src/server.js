import express from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('hello world!'))

app.listen(8080, () => {
    console.log('Example app listening on port 8080!')
})
