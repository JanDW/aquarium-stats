//@ts-check
const { Client } = require("@notionhq/client");

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
}

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
        direction: "descending",
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
  const propertiesById = notionPropertiesById(notionPage.properties);
  return {
    emoji: notionPage?.icon?.emoji ?? null,
    date: propertiesById[n.date]?.date?.start ?? null,
    title: propertiesById[n.notes]?.title[0]?.plain_text ?? null,
    ammonia: propertiesById[n.ammonia]?.number ?? null,
    nitrites: propertiesById[n.nitrites]?.number ?? null,
    nitrates: propertiesById[n.nitrates]?.number ?? null,
    gh: propertiesById[n.gh]?.number ?? null,
    chlorine: propertiesById[n.chlorine]?.number ?? null,
    kh: propertiesById[n.kh]?.number ?? null,
    ph: propertiesById[n.ph]?.number ?? null,
    tds: propertiesById[n.tds]?.number ?? null,
    prime: propertiesById[n.prime]?.number ?? null,
    waterChange: propertiesById[n.waterChange]?.number ?? null,
    stability: propertiesById[n.stability]?.checkbox ?? null,
    co2: propertiesById[n.co2]?.checkbox ?? null,
    bakingSoda: propertiesById[n.bakingSoda]?.checkbox ?? null,
    replacedFilter: propertiesById[n.replacedFilter]?.checkbox ?? null,
    crushedCoral: propertiesById[n.crushedCoral]?.checkbox ?? null,
    fertilizer: propertiesById[n.fertilizer]?.checkbox ?? null,
  };
}

(async () => {
  const pages = await getAquariumLogPages();
  console.log(pages);
})();
