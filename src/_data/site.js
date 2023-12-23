const currentYear = new Date().getFullYear();

module.exports = {
  name: 'Jan De Wilde',
  url: 'https://aquarium.jandewil.de',
  email: 'hi@jandewil.de',
  tagline: 'Jan De Wilde, designer and web developer',
  imgDir: '/assets/img/',
  currentYear,
  navigation: [
    { label: 'Betta tank', url: '/' },
    { label: 'Shrimp tank', url: '/shrimp/' },
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
      avatar: 'https://gravatar.com/avatar/0467288626c0cfc671200f96c34dc192?s=512',
      social: {
        github: 'https://github.com/jandw',
        twitter: 'https://twitter.com/jandw',
        codepen: 'https://codepen.io/JanDW',
      },
    },
  ],
};
