module.exports = {
  bodyClasses: 'home bg-slate-900 text-white font-inter mx-2',
  mainClasses: 'main-grid',
  eleventyComputed: {
    socialImg: (data) => {
      return data.hero.image;
    },
  },
};