const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000;
// const db = require('../database/index.js')
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', express.static('./public'))


app.get('/', (req, res) => res.send('Hello World!'))

app.get('/:SS', (req, res) => {

   // const arg = req.params.SS;

   // db.getItem(arg).then(data => res.send(data));
})

app.get('/price/:SS', (req, res) => {
    const arg = req.params.SS;

    db.getItemPrice(arg).then(data => res.json(data.price)).catch(err => console.log(err));
})

app.get('/prices/all', (req, res) => {
    db.getAllPrices().then(results => res.json(results)).catch(err => console.log(err))
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
