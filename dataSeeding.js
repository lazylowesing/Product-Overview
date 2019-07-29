const faker = require("faker");
const db = require('./database/index.js');

const {
  color,
  productAdjective,
  productMaterial,
  productName
} = faker.commerce;

function imgURLs(range = 5, large = false) {
  let arr = [];
  for (let i = 1; i <= range; i++) {
    arr.push(`${Math.floor(i * 50 * Math.random()) + (large ? 500 : 0)}.jpg`);
  }
  return arr;
}

function generateProduct(SS) {
  const name = `${color()} ${productMaterial()} ${productAdjective()}, ${productName()} ${SS}`
  let item = {
    SS: SS,
    smallImages: imgURLs(5),
    largeImages: imgURLs(5, true),
    summary: [
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence()
    ],

    modelNumber: faker.random.alphaNumeric(6).toUpperCase(),

    price: faker.finance.amount(1, 1000, 2),

    name: name,

    keywords: makePre(name.toUpperCase().split(/[\s-]/)),
  };

  return item
}

async function generateDatabase(rangeMin, rangeMax) {
  for(let i = rangeMin; i <= rangeMax; i++) {
    let arr = [];
    let item;
    for(var j = 1; j <= 10000; j++ ) {
      item = generateProduct((i * 10000) + j);
      arr.push(item);
    }
    let group = await db.Product.collection.insertMany(arr);
    console.log('saved: ', i , 'at: ', Date.now())
  }
}

function makeSuffixes(values) {
  var results = [];
  values.sort().forEach(function(val) {
      var tmp, hasSuffix;
      for (var i=0; i<val.length-2; i++) {
          tmp = val.substr(i).toUpperCase();
          hasSuffix = false;
          for (var j=0; j<results.length; j++) {
              if (results[j].indexOf(tmp) === 0) {
                  hasSuffix = true;
                  break;
              }
          }
          if (!hasSuffix) results.push(tmp);
      }
  });
  return results;
}

function makePre (values) {
  let results = [];
  let test = {};
  values.forEach(keyword => {
    let firstThree = keyword.substr(0,3);
    let str = firstThree;
    if(!test[firstThree]) {
      results.push(str)
      test[firstThree] = true;
    }
    for(let i = 3; i < keyword.length; i++) {
      str += keyword[i];
      if(!test[str])
      results.push(str);
      test[str] = true;
    }
  })
  return results;
}


generateDatabase(0, 999);
