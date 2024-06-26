const markdownIt = require('markdown-it');
const { DateTime } = require('luxon');
const yaml = require('js-yaml');
const bundlerPlugin = require('@11ty/eleventy-plugin-bundle');
const prettier = require('./src/transforms/prettier.js');
const Image = require('@11ty/eleventy-img');

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

  // Passthroughs
  const stuffToCopy = [
    'src/assets/img',
    { 'src/assets/siteroot': '/' },
    {
      'node_modules/chart.js/dist/chart.umd.js': 'assets/scripts/chart.umd.js',
    },
    {
      'node_modules/@11ty/is-land/is-land.js': 'assets/scripts/is-land.js',
    },
    {
      'node_modules/@zachleat/snow-fall/snow-fall.js':
        'assets/scripts/snow-fall.js',
    },
  ];

  stuffToCopy.forEach((stuff) => {
    eleventyConfig.addPassthroughCopy(stuff);
  });

  // Shortcodes
  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return markdownLib.render(content);
  });

  /** Maps a config of attribute-value pairs to an HTML string
   * representing those same attribute-value pairs.
   */
  const stringifyAttributes = (attributeMap) => {
    return Object.entries(attributeMap)
      .map(([attribute, value]) => {
        if (typeof value === 'undefined') return '';
        return `${attribute}="${value}"`;
      })
      .join(' ');
  };

  const imageShortcode = async (
    src,
    alt,
    className = undefined,
    widths = [640, 768, 1024, 1280, 1536],
    formats = ["webp", "jpeg"],
    sizes = "100vw",
  ) => {
    // we'll fill this in shortly
  };

  eleventyConfig.addShortcode("image", imageShortcode);

  module.exports = (eleventyConfig) => {
    eleventyConfig.addShortcode("image", imageShortcode);
  };

  // Plugins
  eleventyConfig.addPlugin(bundlerPlugin);

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

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'MMMM d, yyyy'
    );
  });

  // Filter that converts 2023-12-26 to Dec 26
  eleventyConfig.addFilter('shortDate', (dateStr) => {
    return DateTime.fromISO(dateStr, { zone: 'utc' }).toFormat('MMM dd');
  });

  eleventyConfig.addNunjucksFilter('getData', function (value) {
    return this.ctx[value];
  });

  // Add Custom Data Extensions YAML
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents));

  // Transforms
  eleventyConfig.addTransform("prettier", prettier);

  return {
    dir: {
      // ⚠️ These values are both relative to your input directory.
      includes: '_includes',
      input: 'src',
      output: 'www',
    },
    templateFormats: ['md', 'html', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
  };
};
