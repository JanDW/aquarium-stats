require('dotenv').config();

module.exports = () => ({
  environment: process.env.ELEVENTY_ENV,
  twoGallonId: process.env.NOTION_TWO_GALLON_DB_ID,
  fiveGallonId: process.env.NOTION_FIVE_GALLON_DB_ID,
  tenGallonId: process.env.NOTION_TEN_GALLON_DB_ID,
});
 