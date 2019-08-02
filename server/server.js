const path = require('path');
const fs = require('fs');
var cluster = require('cluster');

let indexHTML = fs.readFileSync(path.join(__dirname, '../public/static.html'), 'utf-8');

let buffer = Buffer.from(indexHTML);
cluster.schedulingPolicy = cluster.SCHED_RR;

if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;
    console.log('Master cluster setting up ' + numWorkers + ' workers...');
    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });
    
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    var app = require('express')();
    app.all('/*', function(req, res) {
            res.set('Content-Type', 'text/html');
            res.send(buffer);
        })
        var server = app.listen(3000, function() {
            console.log('Process ' + process.pid + ' is listening to all incoming requests');
        });
}

