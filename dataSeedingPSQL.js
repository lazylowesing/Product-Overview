const faker = require("faker");
// const db = require('./database/index.js');
const fs = require('fs');
let writer = fs.createWriteStream('./sampleData.csv');

const {
  color,
  productAdjective,
  productMaterial,
  productName
} = faker.commerce;


function createData(id) {
  let str = '';
  str += id + ',';
  str += '"' + id + '",';
  str += faker.random.number({ min: 10000, max: 100000000 }) + ',';
  str += '"' + faker.random.alphaNumeric(6).toUpperCase() + '",';
  str += faker.finance.amount(1, 1000, 2) + ',';
  str += `"${color()} ${productMaterial()} ${productAdjective()} ${productName()}"`
  str += '\n'
  return str;
}

function buildHead() {
  let str = '';

  Array.from(arguments).forEach((col, i) => {
    if(i === arguments.length - 1) {
      str += col + '\n';
    } else {
      str += col + ',';
    }
  })
  return str;
}


function buildMultiData(min,max, multipler) {
  fs.writeFileSync('./sample.csv', buildHead('SS','spreadsheetId', 'itemNumber', 'modelNumber', 'price', 'name', ), {flag: 'a'});
  console.log('head constructed')
  for(let i = min; i <= max; i++) {
    let str = '';
    for(let j = 1; j <= multipler; j++) {
      str += createData((i * multipler) + j);
    }
    fs.writeFileSync('./sample.csv', str, {flag: 'a'})
    console.log(multipler +' record created: ' + (i+ 1) + ' times')
  }
  return;
}

buildMultiData(0,99, 100000);