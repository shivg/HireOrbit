const request = require('request-promise');
const mergeObj = require('lodash.merge');
const config = require('./config');
const db = require('./dbKnex');
const dateFormat = require('dateformat');
const url ='http://api.indeed.com/ads/apisearch'
// ?publisher=788696528762292&q=j&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2'
 
var indeedOptions = {
    uri: 'http://api.indeed.com/ads/apisearch',
    qs: {
        publisher: 788696528762292, 
        q: 'software engineer',
        l: 'san francisco',
        radius: 200,
        format: 'json',
        limit:25,
        userip: '201.176.34.12',
        v:2

    },
    json: true // Automatically parses the JSON string in the response 
};

var fetchAndStoreIndeedJobs = function (index, end) {
  console.log('In Indeed Jobs')
  function randIP() {
    return (parseInt(Math.random()*255)+"")+"."+ (parseInt(Math.random()*255)+"")+"."+ (parseInt(Math.random()*255)+"")+"."+ (parseInt(Math.random()*255)+"")
  }

  if (index > end) {
    // console.log(results.length);
    return;
  }
  var options = {
    qs: {
    start: index
    }
  }
  mergeObj(options, indeedOptions);
  return request(options)
    .then(function (res) {
      var results = translateIndeedJSONToDB(res.results);
      if(!results) throw new Error('Got no data in this request, at Index: ', index);
      console.log(`Results page number is ${res.pageNumber}`);
      // Lowercase Keys
      results = results.map(obj => lowerCaseObjKeys(obj));
      return db('indeed_jobs').insert(results)
    })
    .then(function(dbres) {
      console.log(`Stored Indeed Jobs from ${index} to ${index+25}`);
      index = index+25;
      return setTimeout( function() {
        console.log(`Index is ${index} and end is ${end}`);
        return fetchAndStoreIndeedJobs(index, end);
      }, parseInt((Math.random()*(5000)+3000)) ); 
    })
    .catch(function (err) {
      console.log(err)
    })
    
}

var translateIndeedJSONToDB = function (results) {
  results = results.map(function (job) {
     job.date = dateFormat(job.date, 'yyyy-mm-dd hh:mm:ss');
     job.latitude = JSON.stringify(job.latitude);
     job.longitude = JSON.stringify(job.longitude);
     job.snippet = job.snippet.substring(0, 1499);
     return job;
  });
  return results;
} 

var lowerCaseObjKeys = function (obj) {
  var keys = Object.keys(obj)
  var newObj = {};

  for (var i = 0; i<keys.length;i++){
    var key = keys[i].toLowerCase();
    newObj[key] = obj[keys[i]];
  }
  console.log('lowercase obj is: ', newObj);
  return newObj;
}

return fetchAndStoreIndeedJobs(1,10000);





































