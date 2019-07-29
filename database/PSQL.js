const { Client } = require('pg')
const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'testing',
  user: 'cjfizzle',
  password: '114078145',
})
client.connect().then(console.log('connected to PSQL!')).catch(err =>console.log(err));

client.query('SELECT * FROM products WHERE id=121', (err, res) => {
  if(err) {
    console.log(err ? err.stack : res.rows[0].message)
  } else {
    console.log(res.rows)
  }
  client.end()
})