<h1>Overall Goals:</h1>


1. Spin up two database options and compare performance against 10 million records.
1. Experiment with various server configurations to achieve at least 10,000 requests per second for static files.
1. Design a structure that would support such an application.

*Date: July 23, 2019*

Challenges faced: Researching various DB options for the project, getting the component repos setup.
After researching options for DBs, decided to go with MongoDB and PostgresSQL.

Using MongoDB for first Database choice:
Used npm package ‘faker’ to create a document with fake data that resembles the original Schema.
Faced challenges with saving documents with a reasonable pace:
Used async/await and db.collection.insertMany() to save reliably save ~20,000 records per second (8:54 total for 10M records)
Total size of the database: 3 Gigabytes
Next challenge: setup and seed POSTGRES SQL  DB.
 
*Date: July 24, 2019*

Started with installing and setting up a local POSTGRES SQL database.

First challenge: seeding database with 10M records
Used NodeJS fs to create 10 million lines of CSV (100,000 lines per write).
Used COPY to insert all records into DB all at once. (~112 seconds).

New challenge: Queries by id are taking multiple seconds.

Solution: reseeded the database with id as primary key.

Setting up Travis CI for automated tests for each new push.

Writing tests for MongoDB.

Testing query times for lookup by _id
Appears to be constant time lookup which probably means that the _id’s are stored in a hash table. The first slow query can be explained by waiting for the connection to be established to DB. See below:


Testing query times for lookup by SS number.

Challenge: Queries by ‘SS’ (id) in MongoDB is taking multiple seconds sometimes. It appears that there is no hasing of this value and DBMS is scanning the collection linearly to find the item. Larger SS numbers are taking significantly longer to complete. (Testing range @ 1-1,000,000 to keep times manageable) See below: 

Will research indexes and aggregation.

*Date: July 25, 2019*

After doing some research about indexes and aggregation, ran the following command to create a unique index field around the “SS” number since every SS number will and should be unique:

```db.products.createIndex({SS: 1},{unique: true});```

Retested based on new index of SS number, refactored test to use full range of SS numbers (10,000,000). See results below:

Next challenge: search for products by name or keywords

Created an index on the full name property to reduce search time:

```db.products.createIndex({name: 1})```

Ran tests with complete product names with the following results:

As expected, indexed search was a constant time lookup. About 1.5 ms for a sample size of 1M documents. (No longer first-search due to there being previous test)

New challenge: query a list of products by partial names and partial words

At first, I tried to simply use regEx in my queries with an average search time of 2.5s for 1M document as follows:

```db.products.find({name: /.*olive.*/})```

After some research, decided to add a keyword property to each document using a helper function: 

These full and partial keywords allowed me to search by full and partial keywords in an exclusive manner over 1M documents. Query used:

```db.products.find({ keywords: { $all: ["AWESOME", "GRANITE", 'SHIRT', 'COT'] }})```

Test results:

Noticing a steady increase in query time as more keywords are added. This could be caused by comparisons that mongo needs to do to ensure a document contains all the keywords.

*Date: July 26, 2019*

Challenge: Ramp up to 10 Million documents and test results of name and keyword searches.
	Using the following indexes:
        ```{
                "v" : 2,
                "key" : {
                        "_id" : 1
                },
                "name" : "_id_",
                "ns" : "SDCsample.products"
        },
        {
                "v" : 2,
                "key" : {
                        "keywords" : 1
                },
                "name" : "keywords_1",
                "ns" : "SDCsample.products"
        },
        {
                "v" : 2,
                "key" : {
                        "name" : 1
                },
                "name" : "name_1",
                "ns" : "SDCsample.products"
        },
        {
                "v" : 2,
                "unique" : true,
                "key" : {
                        "SS" : 1
                },
                "name" : "SS_1",
                "ns" : "SDCsample.products"
        }```

	While that spins up, I will work on my PostgresSQL database to continue the setup.

	Created a ‘small’ table for the one-to-many relationship between the products and small image URLs. Inserted 50,000 records into table (5 urls per product) to do some simple query testing before ramping up the number. Queries for the id(primary key) average 0.1ms whereas the product_id take about 2-3ms. After creating an index on product_id, query times start to match the id.

After ramping up to 10 million records with both MongoDB and PostgresSQL, I ran tests to compare the difference between each database using 10 queries of random id numbers. Results below:













MongoDB query : db.Product.findOne({ SS: id });
PostgresSQl query : client.query('SELECT * FROM products WHERE id=' + id);

Noticing that the mongoDB times are about 10x slower than PostgresSQL queries. I’m curious to see if this has something to do with Mongoose’s Model overhead.

I rewrote the test to bypass mongoose using ‘db.Products.collection.findOne’ and got slightly faster results.



I will need to research more about what is causing the  slow queries on Mongo.

My next tests will involve queries per second and stress test the database systems.

Date: July 30, 2019
After running the tests above, I have to choose POSTGRES for the database to deploy and test remotely. Query times seem to be faster even without Pooling connections and Indexing runs faster as well. 
I setup Ubuntu on an AWS EC2 instance and did the following steps to get things ready for deploy:
Installed NVM
Installed Node @ v10
Installed POSTGRESQL
Copied Schemas for Database
Installed Git
Pulled in my repo for the project
Used my data generator js file to create a CSV file on the server with dummy data
Loaded dummy data into POSTGRES
Ran Mocha tests on the EC2 server for id queries.

Results below:





Tests were run directly to the database. Similar results to tests that were locally.

Performed some baseline tests of GET requests for the index.html file(locally). 
Results below:

Date: July 31, 2019

	First Challenge: Vertical Scaling

	For the static html of the proxy server, I will trim down the server to allow it to operate as fast as possible as leave the other operations to the other servers.
	
	Strategies:
Loaded the index.html into buffer so I could serve it up as faster.
Used Nodejs Cluster to fork off child processes in a round robin fashion.

Ran more tests using loadtest to compare times. (artillery seems to bottleneck locally around 1K requests per second). About an 100% increase in requests using child processes. Unfortunely, TC2 instances only have 1 Vcore so I don’t expect to see any difference from the cluster remotely, but the buffering should make a difference.

Localhost:
 




Remote @ 1700RPS


Remote @ 2000RPS

Pushing to 2K requests per seconds causes latency spikes and 20%+ of request errors.

To achieve 10K requests per second, I will need to use load balancing between at least 5 instances.

New strategy:
	After doing some more research, I decided that the fastest way to serve up static files would be to have NGINX serve up the files directly. I used my current instance to test various configurations before making a fresh Ubuntu instance to run systemic tests. Here are the baseline tests with no changes to the configuration file.

@1600RPS							@2000 RPS


Similar results so far to using Node.js. 
After several hours of testing and tweaking setting in nginx, I have concluded that t2.micro can only handle ~1500RPS sustained in various testing scenarios. (many connections).






Date: August 1, 2019
Turns out my conclusion to be wrong! I found that results from loadtest (similar to artillery) were limited by my laptop CPU. I made an account on loader.io and ran some basic tests against a single instance node server and I reached ~2000 RPS. When running tests against my nginx server only. I was able to reach 10K RPS with no errors and along with great response times. Results below.
 

The free version of Loader.io only allows a max of 10K RPS when running tests. To get around this, I asked a friend to make an account and we ran our tests at the same time to find the max RPS of an nginx server on a T2.micro Ubuntu instance. The results below show two tests combining for 15K RPS! 

Above 15K, I saw a sudden jump in errors to 20%. I wondered if the limiting factor here was the nginx ability to respond or the bandwidth capacity of the T2.micro instance. The only way I could think of testing this would be to decrease the size of the html file and see if I saw a different in performance. After cutting the html by 50%, I was able to get 20K RPS.

Date: August 2, 2019

System Design:

In order to achieve high performance, reliability, and scalability for my application, I decided on the  following overall structure:

 
As client requests hit the public socket (load balancer), they will be forwarded to one of three proxy servers running on a separate instance. On the proxy servers, nginx will be responsible for serving static files and handling basic routing. Requests for data will be forwarded to a Node/Express server port that will query the single database running on it’s own instance. Queries will be designed to retrieve data quickly and leave any business logic to be performed by the Node servers. 

Areas for improvement and scalability:

Single point of failure for the database. A read replica of the database would need to be created to ensure that the system could continue to run if one of them fails. A load balancer would need to be introduced between the servers and the databases to balance load and send write operations to the master. 
Decoupling the nginx file server/router from the Node JS server. With the current setup, both would need to scale in order to scale one of the them. If the bottleneck was on the NodeJS servers, then more could be spun up without needing more nginx servers as well.
Caching layers. Inserting a redis caching layer would decrease repetitive queries to the database.

Summary:

	This has shown me that system design requires some serious forward thinking in order to avoid potential bottlenecks and downtime later in development. I have a new appreciation for the process of designing a system that is robust and scalable. Going forward, I will take into consideration the way the front and back ends of my application are communicating and question what the best methods would be to ensure fast, reliable, and scalable solutions. 
