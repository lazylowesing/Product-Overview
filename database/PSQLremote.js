const { Client } = require('pg')
const client = new Client({
  host: 'ec2-52-14-209-114.us-east-2.compute.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'power_user',
  password: '$percussion',
})
client.connect().then(console.log('connected to PSQL!')).catch(err =>console.log(err));

client.query('SELECT * FROM products WHERE id=2345321', (err, res) => {
  if(err) {
    console.log(err ? err.stack : res.rows[0].message)
  } else {
    console.log(res.rows)
  }
  client.end()
})