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
      "---------this is printing in console---------",
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

    // try {
    //   const code = req.query.code;
    //   const res = await fetch("https://api.notion.com/v1/oauth/token", {
    //     method: "post",
    //     headers: new Headers({
    //       Authorization:
    //         "Basic" +
    //         (process.env.NOTION_CLIENT_ID +
    //           ":" +
    //           process.env.NOTION_CLIENT_SECRET),
    //       "Content-Type": "application/json",
    //     }),
    //     body: JSON.stringify({
    //       grant_type: "authorization_code",
    //       code: code,
    //       redirect_uri: "http://localhost:3000",
    //     }),
    //   });
    //   const response = await res.json();
    //   console.log(response);
    // } catch (error) {
    //   console.log(error.message);
    // }

    // -------------redirecting user to the home page
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
