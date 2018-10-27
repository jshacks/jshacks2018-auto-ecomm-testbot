const cssStats = require('cssstats');
const getCss = require('get-css')

module.exports = async function runCss(slug, url) {
  console.log(`-- Start css crawl for ${slug}`);

    const css = await getCss(url);
    const stats = cssStats(css.css, {
        specificityGraph: true,
        repeatedSelectors: true,
        propertyResets: true
    });

    console.log(`-- Done css crawl for ${slug}`);
  return stats

};