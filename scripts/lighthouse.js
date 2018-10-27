const lighthouse = require('lighthouse');

module.exports = function runLighthouse(slug, url, chromeInstance) {
  const opts = {
    output: 'json',
    port  : chromeInstance.port,
  };
  
  console.log(`-- Start lighthouse crawl for ${slug}`);
  
  return lighthouse(url, opts).then(results => {
    // https://github.com/GoogleChrome/lighthouse/blob/master/typings/lhr.d.ts
    // use results.report for the HTML/JSON/CSV output as a string
    // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
    console.log(`-- Done lighthouse crawl for ${slug}`);
    
    return results.lhr;
  });
};