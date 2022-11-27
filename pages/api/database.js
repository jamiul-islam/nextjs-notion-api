const { Client } = require("@notionhq/client");
// const axios = require("axios").default;
import axios from "axios";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const cookies = cookie.parse(
      req ? req.headers.cookie || "" : document.cookie
    );
    const notion = new Client({
      auth: JSON.parse(cookies.secret),
    });
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    res.status(201).json(response.results);
  } else if (req.method === "POST") {
    const result = req.body.page;
    const cookies = cookie.parse(
      req ? req.headers.cookie || "" : document.cookie
    );
    const notion = new Client({
      auth: JSON.parse(cookies.secret),
    });
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
    // res.status(201).json(result);
    console.log(response);
  }
}
