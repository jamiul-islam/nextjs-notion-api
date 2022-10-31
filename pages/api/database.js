const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_SECRET_KEY,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    res.status(200).json({ response });
  } else if (req.method === "POST") {
    const result = req.body.page;
    const response = await notion.pages.update({
      page_id: result.pageId,
      properties: {
        stock_name: {
          title: [
            {
              text: {
                content: result.stockName,
              },
            },
          ],
        },
        Stock_Number: {
          number: result.stockQuantity,
        },
        Checkbox: {
          checkbox: result.isChecked,
        },
      },
    });
    res.status(201).json(response);
  }
}
