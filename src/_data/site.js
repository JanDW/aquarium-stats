//@ts-check
const currentYear = new Date().getFullYear();

module.exports = {
  name: 'Jan De Wilde',
  url: 'https://tanks.jandewil.de',
  email: 'hi@jandewil.de',
  tagline: 'Overkill aquarium stats tracking',
  imgDir: '/assets/img/',
  currentYear,
  navigation: [
    { label: '10 gallon', url: '/' },
    { label: '5 gallon', url: '/five-gallon/' },
    { label: '2 gallon', url: '/two-gallon/' },
  ],
  footerNavigation: [
    { label: 'jandewil.de', url: 'https://jandewil.de/' },
    { label: 'Email', url: 'mailto:hi@jandewil.de' },
  ],
  authors: [
    {
      firstName: 'Jan',
      lastName: 'De Wilde',
      url: 'https://jandewil.de',
      email: 'hi@jandewil.de',
      avatar:
        'https://gravatar.com/avatar/0467288626c0cfc671200f96c34dc192?s=512',
      social: {
        github: 'https://github.com/jandw',
        twitter: 'https://twitter.com/jandw',
        codepen: 'https://codepen.io/JanDW',
      },
    },
  ],
};
