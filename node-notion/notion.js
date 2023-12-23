//@ts-check
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const { writeJson } = require('./library.js');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const fishKeys = {
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
  replacedFilter: 'A%7BFF',
  crushedCoral: 'PKyZ',
  fertilizer: 'yOKq',
  notes: 'title',
  date: 'GuZ%3E',
  spongeClean: '%A%7BFF',
};

const shrimpKeys = {
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
  replacedFilter: '',
  crushedCoral: '',
  fertilizer: 'zPDM',
  notes: 'title',
  date: 'GuZ%3E',
  spongeClean: '%5DUZh',
}

// Use this function to log the properties of a database
// Useful for finding the schema, ids of properties
async function getDatabase(id) {
  const response = await notion.databases.retrieve({
    database_id: id,
  });
  console.log(response);
}



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
  return notionPages.results.map(page => fromNotionObject(page, keys));
}

function notionPropertiesById(properties) {
  return Object.values(properties).reduce((obj, property) => {
    const { id, ...rest } = property;
    return { ...obj, [id]: rest };
  }, {});
}

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
    replacedFilter: propsById[keys.replacedFilter]?.checkbox ?? null,
    crushedCoral: propsById[keys.crushedCoral]?.checkbox ?? null,
    fertilizer: propsById[keys.fertilizer]?.checkbox ?? null,
  };
}

(async () => {
  // getDatabase(process.env.NOTION_FISH_DB_ID);

  const fishData = await getAquariumLogPages(process.env.NOTION_FISH_DB_ID, fishKeys);
  const fishPathToJson = path.join(__dirname, '..', 'src', '_data', 'fishData.json');
  writeJson(fishPathToJson, fishData);

  const shrimpData = await getAquariumLogPages(process.env.NOTION_SHRIMP_DB_ID, shrimpKeys);
  const shrimpPathToJson = path.join(__dirname, '..', 'src', '_data', 'shrimpData.json');
  writeJson(shrimpPathToJson, shrimpData);
})();
