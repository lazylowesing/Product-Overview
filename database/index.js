const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');
 
mongoose.connect('mongodb+srv://evelynbinkard:Aid3n0904@fec-product-overview-1eybm.mongodb.net/FECDB?retryWrites=true&w=majority', {useNewUrlParser: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('connected!');
});

const getItem = (SS) => {
  
  return Product.findOne({SS: {$eq: SS}})
}

const getItemPrice = (SS) => {
  return Product.findOne({SS: {$eq: SS}})
}

const getAllPrices =() => {
  return Product.find({}, {price: 1, SS: 1})
}

const productSchema = new Schema({
  spreadsheetId: String,
  itemNumber: Number,
  modelNumber: String,
  name: String,
  price: Number,
  smallImages: [String],
  largeImages: [String],
  summary: [String],
  SS: Number

  
});

var Product = mongoose.model('Product', productSchema)




module.exports = {db, Product, getItem, getItemPrice, getAllPrices}