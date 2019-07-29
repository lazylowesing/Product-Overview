const { Client } = require('pg')
const client = new Client({
  host: 'ec2-52-14-209-114.us-east-2.compute.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'power_user',
  password: '$percussion',
})
client.connect().then(console.log('connected to PSQL!')).catch(err =>console.log(err));

const getItem = (SS) => {
  const query = {
    name: 'fetch-item',
    text: 'SELECT * FROM products WHERE id = $1',
    values: [SS],
  }

  return client.query(query);
}

const getItemPrice = (SS) => {
  return Product.findOne({SS: {$eq: SS}})
}

const getAllPrices =() => {
  return Product.find({}, {price: 1, SS: 1})
}

module.exports = {getItem, getItemPrice, getAllPrices}