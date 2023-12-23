const markdownIt = require('markdown-it');
const { DateTime } = require('luxon');

module.exports = function (eleventyConfig) {
  const mdOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  };

  const markdownLib = markdownIt(mdOptions);

  eleventyConfig.setLibrary('md', markdownLib);
  eleventyConfig.setUseGitIgnore(true);

  eleventyConfig.addPassthroughCopy('src/assets/scripts');
  eleventyConfig.addPassthroughCopy('src/assets/img');
  //eleventyConfig.addPassthroughCopy('src/assets/styles');
  eleventyConfig.addPassthroughCopy({ 'src/assets/siteroot': '/' });
  eleventyConfig.addPassthroughCopy({
    'node_modules/chart.js/dist/chart.js': 'assets/scripts/chart.js',
  });
  eleventyConfig.addPassthroughCopy({
    'node_modules/@11ty/is-land/is-land.js': 'assets/scripts/is-land.js',
  });
  eleventyConfig.addPassthroughCopy({
    'node_modules/@zachleat/snow-fall/snow-fall.js':
      'assets/scripts/snow-fall.js',
  });

  // Shortcodes
  eleventyConfig.addPairedShortcode('markdown', (content) => {
    return markdownLib.render(content);
  });

  eleventyConfig.addFilter('toHeading', function (value) {
    // Split the string on camelCase boundaries, then capitalize the first letter of each word
    let result = value
      .split(/(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join(' ');

    // Ensure the first letter of the result is capitalized
    result = result.charAt(0).toUpperCase() + result.slice(1);

    return result;
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("MMMM d, yyyy");
  });

  eleventyConfig.addNunjucksFilter("getData", function(value) {
    return this.ctx[value];
  });

  return {
    dir: {
      // ⚠️ These values are both relative to your input directory.
      includes: '_includes',
      layouts: '_layouts',
      input: 'src',
      output: 'www',
    },
    templateFormats: ['md', 'html', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
  };
};
