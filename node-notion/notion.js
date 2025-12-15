//@ts-check
const { Client } = require('@notionhq/client');
const path = require('path');
const { writeJson } = require('./library.js');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// You could opt to store the keys as environment variables, but I prefer to keep them in the code as they are not really sensitive

// 👀 Any changes to the keys, need to be reflected in the fromNotionObject function below, and in the 11tydata.js files

const twoGallonKeys = {
  ammonia: 'CeXJ',
  nitrites: 'yJhy',
  nitrates: 'T%3Bhu',
  gh: '%7Do%3Bs',
  chlorine: 'za_R',
  kh: 'p~%3C%3D',
  ph: 'Nc%3A%5C',
  tds: '%7C~xd',
  prime: '%3Cz~N',
  waterChange: '%3C%5EmE',
  stability: '%7BBBc',
  co2: 'THso',
  bakingSoda: 'JBgL',
  cleanedFilter: '%5DUZh',
  crushedCoral: 'IRJF',
  fertilizer: 'zPDM',
  notes: 'title',
  date: 'GuZ%3E',
  spongeClean: '%5DUZh',
  culture: 'KMGu',
  rootTabs: 'fMyq',
};

const fiveGallonKeys = {
  ammonia: 'CeXJ',
  nitrites: 'yJhy',
  nitrates: 'T%3Bhu',
  gh: '%7Do%3Bs',
  chlorine: 'za_R',
  kh: 'p~%3C%3D',
  ph: 'Nc%3A%5C',
  tds: '%7C~xd',
  prime: '%3Cz~N',
  waterChange: '%3C%5EmE',
  stability: '%7BBBc',
  co2: 'THso',
  bakingSoda: 'JBgL',
  cleanedFilter: '%5DUZh',
  crushedCoral: 'IRJF',
  fertilizer: 'zPDM',
  notes: 'title',
  date: 'GuZ%3E',
  spongeClean: '%5DUZh',
  culture: 'KMGu',
  rootTabs: 'CvmV', 
};

const tenGallonKeys = {
  ammonia: 'CeXJ',
  nitrites: 'yJhy',
  nitrates: 'T%3Bhu',
  gh: '%7Do%3Bs',
  chlorine: 'za_R',
  kh: 'p~%3C%3D',
  ph: 'Nc%3A%5C',
  tds: 'ikhI',
  prime: '%3Cz~N',
  waterChange: '%3C%5EmE',
  stability: '%7BBBc',
  co2: 'Eo%5Be',
  bakingSoda: 'JBgL',
  cleanedFilter: 'A%7BFF',
  crushedCoral: 'PKyZ',
  fertilizer: 'yOKq',
  notes: 'title',
  date: 'GuZ%3E',
  spongeClean: '%A%7BFF',
  culture: 'm%40~I',
  rootTabs: '%3AE%7Bx',
};

/**
 * Fetches and transforms aquarium log pages from a Notion database.
 *
 * @param {string} id - The ID of the Notion database.
 * @param {Object} keys - The keys used to access specific properties in the Notion database.
 * @param {string} keys.date - The key for the date property in the Notion database.
 * @returns {Promise<Array>} A promise that resolves to an array of aquarium log pages.
 */

async function getAquariumLogPages(id, keys) {
  const notionPages = await notion.databases.query({
    database_id: id,
    sorts: [
      {
        property: keys.date,
        direction: 'descending',
      },
    ],
  });
  return notionPages.results.map((page) => fromNotionObject(page, keys));
}

/**
 * Transforms the properties object from Notion into an object keyed by property ID.
 *
 * @param {Object} properties - The properties object from Notion.
 * @returns {Object} An object where each key is a property ID and each value is the corresponding property, excluding the ID.
 */

function notionPropertiesById(properties) {
  return Object.values(properties).reduce((obj, property) => {
    const { id, ...rest } = property;
    return { ...obj, [id]: rest };
  }, {});
}

/**
 * Transforms a Notion page object into a more convenient format.
 *
 * @param {Object} notionPage - The Notion page object to transform.
 * @param {Object} keys - An object mapping property names to their IDs in the Notion database.
 * @returns {Object} An object containing the transformed properties of the Notion page.
 */

function fromNotionObject(notionPage, keys) {
  // const id = notionPage.id;
  const propsById = notionPropertiesById(notionPage.properties);
  return {
    emoji: notionPage?.icon?.emoji ?? null,
    date: propsById[keys.date]?.date?.start ?? null,
    title: propsById[keys.notes]?.title[0]?.plain_text ?? null,
    ammonia: propsById[keys.ammonia]?.number ?? null,
    nitrites: propsById[keys.nitrites]?.number ?? null,
    nitrates: propsById[keys.nitrates]?.number ?? null,
    gh: propsById[keys.gh]?.number ?? null,
    chlorine: propsById[keys.chlorine]?.number ?? null,
    kh: propsById[keys.kh]?.number ?? null,
    ph: propsById[keys.ph]?.number ?? null,
    tds: propsById[keys.tds]?.number ?? null,
    prime: propsById[keys.prime]?.number ?? null,
    waterChange: propsById[keys.waterChange]?.number ?? null,
    stability: propsById[keys.stability]?.checkbox ?? null,
    co2: propsById[keys.co2]?.checkbox ?? null,
    bakingSoda: propsById[keys.bakingSoda]?.checkbox ?? null,
    cleanedFilter: propsById[keys.cleanedFilter]?.checkbox ?? null,
    crushedCoral: propsById[keys.crushedCoral]?.checkbox ?? null,
    fertilizer: propsById[keys.fertilizer]?.checkbox ?? null,
    culture: propsById[keys.culture]?.checkbox ?? null,
    rootTabs: propsById[keys.rootTabs]?.checkbox ?? null,
  };
}

(async () => {
  const twoGallonData = await getAquariumLogPages(
    process.env.NOTION_TWO_GALLON_DB_ID,
    twoGallonKeys
  );
  const twoGallonPathToJson = path.join(
    __dirname,
    '..',
    'src',
    '_data',
    'twoGallonData.json'
  );
  writeJson(twoGallonPathToJson, twoGallonData);

  const fiveGallonData = await getAquariumLogPages(
    process.env.NOTION_FIVE_GALLON_DB_ID,
    fiveGallonKeys
  );
  const fiveGallonPathToJson = path.join(
    __dirname,
    '..',
    'src',
    '_data',
    'fiveGallonData.json'
  );
  writeJson(fiveGallonPathToJson, fiveGallonData);

  const tenGallonData = await getAquariumLogPages(
    process.env.NOTION_TEN_GALLON_DB_ID,
    tenGallonKeys
  );
  const tenGallonPathToJson = path.join(
    __dirname,
    '..',
    'src',
    '_data',
    'tenGallonData.json'
  );
  writeJson(tenGallonPathToJson, tenGallonData);

  module.exports = { tenGallonData, fiveGallonData };
})();
