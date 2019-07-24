const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000;
const db = require('../database/index.js')
// const saveImage = require('../database/downloadPhotos')
const cors = require('cors');

const whiteList = ['http://fec-lowes-proxy.us-east-2.elasticbeanstalk.com','http://fec-lowes-carousel.us-east-2.elasticbeanstalk.com', 'http://fec-proxy.us-east-1.elasticbeanstalk.com', 'http://lowesproxy-env.6tim4uzsty.us-east-2.elasticbeanstalk.com', 'http://localhost:3000']

const corsOptions = {
    credentials: true,
    origin: function (origin, cb) {
        if (whiteList.indexOf(origin !== -1 || !origin)) {
            cb(null, true)

        } else {
            cb(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./public'))


app.get('/', (req, res) => res.send('Hello World!'))

app.get('/:SS', (req, res) => {

    const arg = req.params.SS;

    db.getItem(arg).then(data => res.send(data));
})

app.get('/price/:SS', (req, res) => {
    const arg = req.params.SS;

    db.getItemPrice(arg).then(data => res.json(data.price)).catch(err => console.log(err));
})

app.get('/prices/all', (req, res) => {
    db.getAllPrices().then(results => res.json(results)).catch(err => console.log(err))
})

app.listen(port, () => console.log(`app listening on port ${port}!`))