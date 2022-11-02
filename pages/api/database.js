const { Client } = require("@notionhq/client");
// const axios = require("axios").default;
import axios from "axios";

const notion = new Client({
  auth: process.env.NOTION_SECRET_KEY,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    // -------------checking if i have the redirected code
    console.log(
      "---------this is printing in terminal---------",
      req.query.code
    );
    const code = req.query.code;
    // res.status(200).json("Hello World");
    // -------------authenticating user
    axios({
      method: "post",
      url: "https://api.notion.com/v1/oauth/token",
      headers: {
        Authorization: `Basic ${
          process.env.NOTION_CLIENT_ID + ":" + process.env.NOTION_CLIENT_SECRET
        }`,
        "Content-Type": "application/json",
      },
      data: {
        grant_type: "authorization_code",
        code: code,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err.message);
      });
    res.redirect(307, "/");
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
