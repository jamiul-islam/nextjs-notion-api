const { Client } = require("@notionhq/client");
// const axios = require("axios").default;
import axios from "axios";

const notion = new Client({
  auth: process.env.NOTION_SECRET_KEY,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json("Hello World");
    // res.redirect(307, "/");
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
