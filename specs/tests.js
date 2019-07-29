var assert = require("assert");
var expect = require("chai").expect;
var should = require("chai").should();
const db = require("../database/index.js");
const convertHrtime = require("convert-hrtime");
const { Client } = require("pg");
const client = new Client({
  host: "localhost",
  port: 5432,
  database: "testing",
  user: "cjfizzle",
  password: "114078145"
});

before(done => {
  client
    .connect()
    .then(res => {
      console.log(res, 'connection successful')
      done()
    })
    .catch(err => console.log('connection error: ',err));
  db.db.once("open", function() {
  });
});

// describe("makes a query to the database based on _id", function() {
//   let IDs = ['5d37a92bd809094094526527', '5d37a930d80909409453ebc6','5d37a944d8090940945a0646','5d37a98bd80909409470e9a6', '5d37ab19d809094094eafba5']
//   let docNum = [1, 100000, 500000, 2000000, 9999999];
//   IDs.forEach(async (id,i) => {
//     await new Promise((res, rej) => {
//       it(
//         `should return data for a product with _id: ${id} with SS#: ${docNum[i]} in under 50ms`,
//         function() {
//           this.timeout(5000);
//           let time = process.hrtime();
//           return new Promise((res2, rej2) => {
//             db.Product.findOne({ _id: id }).exec((err, results) => {
//               if (err) {
//                 expect(err).to.be(null);
//                 rej(err);
//                 rej2(err);
//               } else {
//                 let timing = convertHrtime(process.hrtime(time));
//                 res(timing.milliseconds);
//                 res2(timing.milliseconds);
//                 expect(timing.milliseconds).to.be.most(50);
//               }
//             });
//           });
//         }
//       );
//     })
//       .then(time => console.log("milliseconds: " + time))
//       .catch(err => console.log(err));
//   });
// });

// describe("makes 10 queries to MongoDB for random id of Product", function() {
//   let IDs = new Array(10)
//     .fill(1)
//     .map(index => index + Math.floor(Math.random() * 10000000));
//   IDs.forEach(async id => {
//     return await new Promise((res, rej) => {
//       it(
//         "should return data for a product " + id + " in under 50ms",
//         async function() {
//           this.timeout(5000);
//           let time = process.hrtime();
//           return await db.Product.collection.findOne({ SS: id })
//           .then(results => {
//             let timing = convertHrtime(process.hrtime(time));
//             res(timing.milliseconds)
//             expect(timing.milliseconds).to.most(50)
//           })
//         })
//       })
//   .then(time => console.log("milliseconds: " + time))
//   // .catch(err => console.log(err));

//   });
// });

// describe("makes a query to the database for the first 10 product names based on partial keywords", function() {
//   let IDs = ["olive Metal Fantastic, Generic Metal Shoes", "plum Wooden Fantastic, Handmade Cotton Keyboard", "fuchsia Wooden Generic, Handcrafted Plastic Shoes", "green Fresh Awesome, Ergonomic Rubber Hat", "lavender Fresh Awesome, Unbranded Metal Table"]
//   IDs.forEach(async name => {
//     await new Promise((res, rej) => {
//       it(
//         "should return data for a product " + name + " in under 200ms",
//         function() {
//           this.timeout(5000);
//           let time = process.hrtime();
//           return new Promise((res2, rej2) => {
//             db.Product.find({ name: name}, {name:1}).limit(10).exec(
//               (err, results) => {
//                 if (err) {
//           expect(err).to.be(null);
//           rej(err);
//           rej2(err);
//             } else {
//               let timing = convertHrtime(process.hrtime(time));
//               res(timing.milliseconds);
//               res2(timing.milliseconds);
//               expect(timing.milliseconds).to.be.most(250);
//             }

//             });
//           });
//         }
//       );
//     })
//       .then(time => console.log("milliseconds: " + time))
//       .catch(err => console.log(err));
//   });
// });

describe("makes 10 queries to PostGresSQL for random id of product", function() {
  let IDs = new Array(10)
    .fill(1)
    .map(index => index + Math.floor(Math.random() * 10000000));
  IDs.forEach(async id => {
    return await new Promise((res, rej) => {
      it("should return data for a product " + id + " in under 50ms", async function() {
          this.timeout(5000);
          let time = process.hrtime();
          return await client.query('SELECT * FROM products WHERE id=' + id)
          .then(results => {
            let timing = convertHrtime(process.hrtime(time));
            res(timing.milliseconds)
            expect(timing.milliseconds).to.most(50)
          })
            });
          })
          .then(time => console.log("milliseconds: " + time))
          // .catch(err => console.log(err));
        })
});

describe("makes 100 simultaneous queries to PostGresSQL for random id of product and times total completion time", function() {
  let IDs = new Array(100)
    .fill(1)
    .map(index => index + Math.floor(Math.random() * 10000000));
  it("should return data for 20 queries", async function() {
    this.timeout(5000);
    const promises = IDs.map(id => {
      const time = process.hrtime();
      return client.query("SELECT * FROM products WHERE id=" + id)
              .then(res =>{

                let diff = convertHrtime(process.hrtime(time)).milliseconds;
                return diff;
              })
    });
    let totalTimeStart = process.hrtime();
    await Promise.all(promises).then(res => {
      let totalTimeDifference = convertHrtime(process.hrtime(totalTimeStart)).milliseconds;
      res = res.map((time,i) => {
        if(i===0){
          return `${(time).toFixed(2)}ms for query ${i+1}`;
        } else if(i ===promises.length -1){
          return `${(totalTimeDifference - time).toFixed(2)}ms for query ${i+1}`
        } else {
          `${(time - res[i-1]).toFixed(2)}ms for query ${i+1}`
          return `${(time - res[i-1]).toFixed(2)}ms for query ${i+1}`
        }
      })
      console.log('individual times: ', res)
                      console.log(
                              `total time for 100 queries: ${totalTimeDifference}ms`
                              );
    });
  });
});

after(done => {
  db.db.close();
  client.end();
  done();
});
