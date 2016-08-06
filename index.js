/**
* Required modules
**/
const fs      = require('fs');
const _       = require('underscore');
const async   = require('async');
const redis   = require('redis');
const crypto  = require('crypto');

/**
* Object to expose
**/
var Phishtank = {};

/**
* Load in the nice and big blacklist, 
* with a timeout for safety
**/
Phishtank.loadBlacklist = function(options, fn) {

  // make sure to be only called once
  var callback  = _.once(fn);
  var timer     = null;

  // read in the file buffer
  fs.readFile(options.file || './blacklist.json', function(err, data){

    // check for a error and return 
    if(err) return callback(err);

    // right so parse the response
    var body = JSON.parse(data.toString());

    // stop the timer
    if(timer) clearTimeout(timer);

    // return the body
    callback(null, body);

  });

  // after 5 minutes, just timeout
  timer = setTimeout(function() {

    // done with error
    callback(new Error('Gave up after 5 minutes ...'));

  }, 1000 * 60 * 5);

};

/**
* Starts the download process
**/
Phishtank.boot = function(options, fn) {

  // clean callback
  var callback = _.once(fn);

  // debugging
  if(options.debug === true)
    console.log('loading blacklist...');

  // first load the blacklist
  Phishtank.loadBlacklist(options, function(err, list) {

    // check for a error
    if(err) {

      // output the error
      if(options.debug === true) {

        // output a friendly message
        console.error('Problem loading the blacklist');

        // output the stacktrace
        console.dir(err);

      }

      // exit
      return callback(err);

    }

    // keep track how many we actually saved
    var count = 0;

    // debug
    if(options.debug === true)
      console.log('Found ' + list.length + ' records in blacklist');

    /**
    * Pick a server to connect to
    **/
    var servers = (process.env.CACHE_SERVER || process.env.REDIS_SERVER || '127.0.0.1').split(',');
    var server = servers[Math.floor(Math.random()*servers.length)];

    // debug
    if(options.debug === true)
      console.log('connecting to redis server: ' + server);

    /**
    * Creating the actual client for redis
    **/
    var client = redis.createClient(6379, server);

    // exit if we can't connect
    var exitTimer = setTimeout(function() {

      // debugging
      if(options.debug === true)
        console.log('process took longer than 20 minutes, stopping now ...')

      // stop
      callback(new Error('process took longer than 20 minutes, stopping now ...'))

    }, 1000 * 60 * 20);

    /**
    * Handle any error from connection
    **/
    client.on('error', function(err) {

      // check for debugging
      if(options.debug === true) {

        // output the error
        console.error('Problem connecting to redis');

        // otutput stack
        console.dir(err);

      }

      // done
      fn(err);

    });

    // output the error
    if(options.debug === true) 
      console.log('connection to ' + server + ' success !');

    // list of chunks
    var chunks = [];
    var len     = 1000;

    // devide the list up in chunks of len
    for(var i = 0; i < list.length; i++) {

      // if mod of len
      if(i % len == 0) chunks.push(i);

    }

    // run each chunk
    async.eachLimit(chunks, 1, function(chunk, cbb) {

      // debug
      if(options.debug === true) 
        console.log('processing records from index ' + chunk + ' till ' + (chunk + len));

      // add each of these results to the cache
      async.eachLimit(list.slice(chunk, chunk + len), 1, function(entry, cb) {

        // check if verified
        if(entry.verified != 'yes') 
          return cb(null);

        // must have a url
        if(!entry.url) 
          return cb(null);

        // increment
        count++;

        // create the sha1 hash
        var shasum  = crypto.createHash('sha1');
        shasum.update(entry.url.toLowerCase());
        var hash    = shasum.digest('hex');

        // create the key
        var key = [

          'passmarked',
          'phishtank',
          hash

        ].join(':');

        // save in redis
        client.set(key, JSON.stringify([ entry ]), function (err) {

          // set to expire in 2 days if not updated before then
          client.expire(key, 60 * 24 * 2, function(err) {

            // done
            cb(null);

          });

        });

      }, function() {

        // done
        cbb(null);

      });

    }, function() {

      // debug
      if(options.debug === true)
        console.log('Cached ' + count + ' out of the ' + list.length + ' known phishing attacks')

      // close redis connection
      client.quit();

      // done
      callback(null);

    });

  });

};

/**
* Expose as the module
**/
module.exports = exports = Phishtank;