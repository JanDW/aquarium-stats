require('dotenv').config();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_TOKEN });

/**
 * Retrieves a Notion database by its ID.
 * This function is useful for logging the properties of a database,
 * which can help you find the schema and IDs of properties.
 *
 * @param {string} id - The ID of the Notion database to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the retrieved Notion database.
 */
async function getDatabase(id) {
  const response = await notion.databases.retrieve({
    database_id: id,
  });
  console.log(response);
}


(async () => {
  getDatabase(process.env.NOTION_FIVE_GALLON_DB_ID);
  // getDatabase(process.env.NOTION_FIVE_GALLON_DB_ID);
})();