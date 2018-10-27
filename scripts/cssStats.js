const cssStats = require('cssstats');

module.exports.cssStats  =  async (url) => {
    let css = await cssStats(url);

    return cssStats(css.css, {
        specificityGraph: true,
        repeatedSelectors: true,
        propertyResets: true
    })
};



