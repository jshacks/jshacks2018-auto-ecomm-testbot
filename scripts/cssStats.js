const cssStats = require('cssstats');
const getCss = require('get-css');
const uniq = require('lodash').uniq;
const _ = require('lodash');
const Decimal = require('decimal.js');

function getScore(min, max, value) {
    if (!value) return 0;
    if (value <= 0) return 0;

    let step = new Decimal(max).sub(min).div(100);
    let score = new Decimal(100).sub(new Decimal(value).div(step));

    if (score < 0) return 0;
    if (score > 100) return 100;
    return score;
}

module.exports = async function runCss(slug, url) {
    console.log(`-- Start css crawl for ${slug}`);
    let object, stats;
    try {
        const css = await getCss(url);
        stats = cssStats(css.css, {
            specificityGraph: true,
            repeatedSelectors: true,
            propertyResets: true,
            mediaQueries: false,

        });

        object = {
            uniqueColor: getScore(20, 150, uniq(stats.declarations.properties.color).length),
            backgroundColor: getScore(5, 20, uniq(stats.declarations.properties['background-color']).length),
            fontSize: getScore(10, 30, uniq(stats.declarations.properties['font-size']).length),
            fontFamily: getScore(5, 10, uniq(stats.declarations.properties['font-family']).length),
        };

        let array = [];
        array.push(...stats.declarations.properties['padding-bottom'], ...stats.declarations.properties['padding-right'],
            ...stats.declarations.properties['padding-top'], ...stats.declarations.properties['padding-left']);


        stats.declarations.properties['padding'].map((entry) => {
            array.push(...entry.split(" "))
        })
        let paddingReducer = {
            pixels: 0,
            percentage: 0,
            relatives: 0
        };

        array.map(entry => {
            if (entry.includes("px")) paddingReducer.pixels++;
            else if (entry.includes("%")) paddingReducer.percentage++;
            else if (entry.includes("em")) paddingReducer.relatives++;
        })

        object.padding = getScore(100, 200, paddingReducer.pixels);

    } catch (e) {
    }

    console.log(`-- Done css crawl for ${slug}`);
    return object

};