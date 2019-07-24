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
  const countForImgs = Math.floor(Math.random() * 10) + 1;
  let item = {
    SS: SS,
    smallImages: imgURLs(countForImgs),
    largeImages: imgURLs(countForImgs, true),
    summary: [
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence()
    ],

    itemNumber: faker.random.number({ min: 10000, max: 100000000 }),

    modelNumber: faker.random.alphaNumeric(6).toUpperCase(),

    price: faker.finance.amount(1, 1000, 2),

    name: `${color()} ${productMaterial()} ${productAdjective()}, ${productName()}`,

    spreadsheetId: SS.toString(),
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

generateDatabase(0, 999);
