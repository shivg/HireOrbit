const db = require('../../db/dbKnex');
const request = require('request-promise');
const cheerio = require('cheerio');
const companyLogoObj = {};

const companyLogoSpaced = {}





// for all jobs in  db , fetch images
db.raw(`select * from indeed_jobs`)
  .then(results => {
    var companyListSingle = results.rows.filter(job => job.company.indexOf(' ') === -1).map(job => job.company);
    var companyListSpaced = results.rows.filter(job => job.company.indexOf(' ') !== -1).map(job => job.company);
    // console.log(companyListSpaced, companyListSingle)


// Get google search for all companies // 
var promisesSpaced = ['united airlines'].map(company => {
  return new Promise(function(resolve, reject) {
    var searchFormat = company.split(" ").join("+");
    var option = {
      uri: `http://www.google.com/?#q=%22${searchFormat}%22`,
        resolveWithFullResponse: true,
        headers: {
          'User-Agent': 'Request-Promise'
      }
    }

    request(option)
      .then(res => {
        // console.log(res)
        resolve([res.request.uri.href, res.body]);
      })
      .catch(console.log)
  });
});

// Promise.all(promisesSpaced)
//   .then(allResolves => {
//     allResolves.map(arrayURLBody => {
//       // console.log(arrayURLBody[0]);

//       var companyURL = arrayURLBody[0];
//       var resBody = arrayURLBody[1];

//       var $ = cheerio.load(resBody);
//       // console.log($('img')[0])
//       // var logoNodes = Array.prototype.slice.call($('script'));
//       // console.log(lo)
//     })
//   })
//   .catch(console.log)
  // first link fetch page  
    // use same logic for logoNodes

//   First link can be twitter

// class = med > [1]
//  First H3 <a href is the link to I’m feeling lucky>



var promisesList = companyListSingle.map(company => {
  return new Promise(function(resolve, reject) {
    var reqOption = {
      uri: `http://www.${company}.com`,
      resolveWithFullResponse: true,
      headers: {
        'User-Agent': 'Request-Promise'
    }
    }
    request(reqOption)
      .then(res => {
        resolve([res.request.uri.href, res.body]);
      })
  })
})


Promise.all(promisesList)
  .then(function (vals) {
    vals.forEach((arrayURLBody) => {
      var companyURL = arrayURLBody[0];
      var resBody = arrayURLBody[1];

      var $ = cheerio.load(resBody);
      // console.log($('img')[0])
      var logoNodes = Array.prototype.slice.call( $('img') )
        .filter(imgNode => {
       if (imgNode.type === 'tag' && imgNode.name === 'img' && imgNode.attribs.src && (imgNode.attribs.src.toLowerCase().indexOf('logo') > -1 || imgNode.attribs.src.toLowerCase().indexOf('brand') > -1) ){
        return true
       } else {
        return false;
       }
      }).map(logo => logo.attribs.src);
      // logoNodes = logoNodes.map(node => node.attribs.src);
     companyLogoObj[companyURL] = logoNodes
    })
    var bigQuery = "";
    for(var companyKey in companyLogoObj){
      var companyName = companyKey;
      var pathlist = companyLogoObj[companyKey];
      bigQuery+=(`insert into logos(company, path) VALUES('${companyName}', '${pathlist}');`)
    }
    db.raw(bigQuery)
      .then((stored) => console.log(stored))
      .catch(err => console.log(err))
  
  })
  .then(result => console.log(companyLogoObj))
  .catch(err => console.log('err:', err, 'logos: ', logos))

  })
  .catch(err => console.log(err))


