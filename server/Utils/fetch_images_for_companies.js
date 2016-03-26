const db = require('../../db/dbKnex');
const request = require('request-promise');
const cheerio = require('cheerio');
const companyLogoObj = {};

var htmlparser = require("htmlparser2");



db.raw(`select * from indeed_jobs`)
  .then(results => {
    var companyListSingle = results.rows.filter(job => job.company.indexOf(' ') === -1).map(job => job.company);
    var companyListSpaced = results.rows.filter(job => job.company.indexOf(' ') !== -1).map(job => job.company);
    // console.log(companyListSpaced, companyListSingle)



  



var promisesList = companyListSingle.concat('amazon').map(company => {
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
        // console.log(res)
        resolve([res.request.uri.href, res.body]);
        // parser.write(res.body);
        // parser.end(resolve);
      })
  })
})


Promise.all(promisesList)
  .then(function (vals) {
      // var dom = htmlparser.parseDOM(vals[0][1]);
          // console.log(dom)
          // parser.write(vals[0][1]);
    vals.forEach((arrayURLBody) => {
      var companyURL = arrayURLBody[0];
      var resBody = arrayURLBody[1];

      var $ = cheerio.load(vals[0][1]);
      // console.log($('img')[0])
      var logoNodes = Array.prototype.slice.call( $('img') )
        .filter(imgNode => {
       if (imgNode.type === 'tag' && imgNode.name === 'img' && imgNode.attribs.src && imgNode.attribs.src.toLowerCase().indexOf('logo') > -1){
        return true
       } else {
        return false;
       }
      }).map(logo => logo.attribs.src);
      // logoNodes = logoNodes.map(node => node.attribs.src);
     companyLogoObj[companyURL] = logoNodes
    })
  
  })
  .then(result => console.log(companyLogoObj))
  .catch(err => console.log('err:', err, 'logos: ', logos))

  })
  .catch(err => console.log(err))


