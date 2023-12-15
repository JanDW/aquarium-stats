//@ts-check
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const { writeJson } = require('./library.js');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const n = {
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
};

// Use this function to log the properties of a database
// Useful for finding the schema, ids of properties
async function getDatabase(id) {
  const response = await notion.databases.retrieve({
    database_id: id,
  });
  console.log(response);
}

async function getAquariumLogPages() {
  const notionPages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    sorts: [
      {
        property: n.date,
        direction: 'descending',
      },
    ],
  });
  return notionPages.results.map(fromNotionObject);
}

function notionPropertiesById(properties) {
  return Object.values(properties).reduce((obj, property) => {
    const { id, ...rest } = property;
    return { ...obj, [id]: rest };
  }, {});
}

function fromNotionObject(notionPage) {
  // const id = notionPage.id;
  const propsById = notionPropertiesById(notionPage.properties);
  return {
    emoji: notionPage?.icon?.emoji ?? null,
    date: propsById[n.date]?.date?.start ?? null,
    title: propsById[n.notes]?.title[0]?.plain_text ?? null,
    ammonia: propsById[n.ammonia]?.number ?? null,
    nitrites: propsById[n.nitrites]?.number ?? null,
    nitrates: propsById[n.nitrates]?.number ?? null,
    gh: propsById[n.gh]?.number ?? null,
    chlorine: propsById[n.chlorine]?.number ?? null,
    kh: propsById[n.kh]?.number ?? null,
    ph: propsById[n.ph]?.number ?? null,
    tds: propsById[n.tds]?.number ?? null,
    prime: propsById[n.prime]?.number ?? null,
    waterChange: propsById[n.waterChange]?.number ?? null,
    stability: propsById[n.stability]?.checkbox ?? null,
    co2: propsById[n.co2]?.checkbox ?? null,
    bakingSoda: propsById[n.bakingSoda]?.checkbox ?? null,
    replacedFilter: propsById[n.replacedFilter]?.checkbox ?? null,
    crushedCoral: propsById[n.crushedCoral]?.checkbox ?? null,
    fertilizer: propsById[n.fertilizer]?.checkbox ?? null,
  };
}

(async () => {
  const pages = await getAquariumLogPages();
  const pathToJson = path.join(__dirname, '..', 'src', '_data', 'ten-gallon.json');
  writeJson(pathToJson, pages);
})();
