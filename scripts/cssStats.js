const cssStats = require('cssstats');
const getCss = require('get-css');
const uniq = require('lodash').uniq;

module.exports = async function runCss(slug, url) {
  console.log(`-- Start css crawl for ${slug}`);

    const css = await getCss(url);
    let stats = cssStats(css.css, {
        specificityGraph: true,
        repeatedSelectors: true,
        propertyResets: true
    });

    let object =  {};
    object.uniqueColor = uniq(stats.declarations.properties.color).length;
    object.backgroundColor = uniq(stats.declarations.properties['background-color']).length;
    object.fontSize = uniq(stats.declarations.properties['font-size']).length;
    object.fontFamily = uniq(stats.declarations.properties['font-family']).length;


    console.log(`-- Done css crawl for ${slug}`);
  return object

};