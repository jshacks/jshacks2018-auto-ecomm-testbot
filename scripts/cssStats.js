const cssStats = require('cssstats');

module.exports = function runCss(slug, url) {
  console.log(`-- Start css crawl for ${slug}`);
  
  const promise = new Promise((resolve, reject) => {
    const stats = cssStats(url, {
      specificityGraph : true,
      repeatedSelectors: true,
      propertyResets   : true,
    });
  
    console.log(`-- Done css crawl for ${slug}`);
  
    resolve(stats);
  });
  
  return promise;
};