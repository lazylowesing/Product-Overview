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

function imgURLs(large = false) {
  return `${Math.floor(500 * Math.random()) + (large ? 500 : 0)}.jpg`;
}

function createData(pid) {
  let str = '';
  str += pid + ',';
  str += `"${imgURLs()}"` +'\n'
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
  fs.writeFileSync('./images.csv', buildHead('product_id', 'image_url'), {flag: 'a'});
  console.log('head constructed')
  for(let i = min; i <= max; i++) {
    let str = '';
    for(let j = 1; j <= multipler; j++) {
      for(let k = 0; k < 5; k++) {
        str += createData((i * multipler) + j);
      }
    }
    fs.writeFileSync('./images.csv', str, {flag: 'a'})
    console.log(multipler +' record created: ' + (i+ 1) + ' times')
  }
  return;
}

buildMultiData(0,99, 100);