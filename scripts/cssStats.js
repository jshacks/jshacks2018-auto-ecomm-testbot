const cssStats = require('cssstats');
const getCss = require('get-css');
const uniq = require('lodash').uniq;

module.exports = async function runCss(slug, url) {
  console.log(`-- Start css crawl for ${slug}`);
    let object,stats;
    try {
        const css = await getCss(url);
        stats = cssStats(css.css, {
            specificityGraph: true,
            repeatedSelectors: true,
            propertyResets: true,
            mediaQueries: false,

        });

         object = {
        uniqueColor :uniq(stats.declarations.properties.color).length,
        backgroundColor : uniq(stats.declarations.properties['background-color']).length,
        fontSize : uniq(stats.declarations.properties['font-size']).length,
        fontFamily : uniq(stats.declarations.properties['font-family']).length
    };
        let array = [];
        array.push(...stats.declarations.properties['padding-bottom'], ...stats.declarations.properties['padding-right'],
            ...stats.declarations.properties['padding-top'], ...stats.declarations.properties['padding-left']);


        stats.declarations.properties['padding'].map((entry) => {
            array.push(...entry.split(" "))
        })
        let paddingReducer = {
            pixels: 0,
            procents: 0,
            relatives: 0
        };

        array.map(entry => {
            if (entry.includes("px")) paddingReducer.pixels++;
            else if (entry.includes("%")) paddingReducer.procents++;
            else if (entry.includes("em")) paddingReducer.relatives++;
        })

        object.padding = paddingReducer;

    }catch (e) {
    }
    console.log(`-- Done css crawl for ${slug}`);
  return object

};