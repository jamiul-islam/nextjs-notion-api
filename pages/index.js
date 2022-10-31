import Head from "next/head";
import { useState } from "react";
import { Client } from "@notionhq/client";
import Swal from "sweetalert2";

export default function Home({ data }) {
  const [stock, setStock] = useState(data);
  // const [stock, setStock] = useImmer(data);

  const handleName = (stockId, stockName) => {
    setStock(
      stock.map((piece) => {
        if (piece.id === stockId) {
          return {
            ...piece,
            properties: {
              ...piece.properties,
              stock_name: {
                ...piece.properties.stock_name,
                title: {
                  ...piece.properties.stock_name?.title,
                  0: {
                    ...piece.properties.stock_name?.title[0],
                    text: {
                      ...piece.properties.stock_name?.title[0]?.text,
                      content: stockName,
                    },
                  },
                },
              },
            },
          };
        } else {
          return piece;
        }
      })
    );
  };

  const handleNumber = async (stockId, number) => {
    setStock(
      stock.map((piece) => {
        if (piece.id === stockId) {
          return {
            ...piece,
            properties: {
              ...piece.properties,
              Stock_Number: {
                ...piece.properties?.Stock_Number,
                number: number,
              },
            },
          };
        } else {
          return piece;
        }
      })
    );
    // setStock(draft => {
    //   draft.properties?.Stock_Number.number = number;
    // });
  };

  const onToggle = (stockId, nextSeen) => {
    setStock(
      stock.map((piece) => {
        if (piece.id === stockId) {
          return {
            ...piece,
            properties: {
              ...piece.properties,
              Checkbox: {
                ...piece.properties.Checkbox,
                checkbox: nextSeen,
              },
            },
          };
        } else {
          return piece;
        }
      })
    );
  };

  const handleSubmit = async (id, name, quantity, checkBool) => {
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: {
          stockName: name === undefined ? "" : name,
          stockQuantity: parseInt(quantity) === null ? 0 : parseInt(quantity),
          pageId: id,
          isChecked: checkBool,
        },
      }),
    });
    const pageData = await response.json();
    console.log(pageData);
    Swal.fire("YAAY!", "Data added to Notion Successfully", "success");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>my notion sheet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Jamiul's <a className="text-blue-600">spreadsheet plugin</a> for
          notion
        </h1>
        {/* <button onClick={handleQuery}>
          <h2 className="text-2xl text-rose-400 font-bold rounded-xl border p-4 mt-4 border-rose-400 hover:text-rose-500 hover:bg-rose-100">
            <a href="https://api.notion.com/v1/oauth/authorize?client_id=19ab6125-8554-4494-a839-53c4f6868644&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F">
              + notion
            </a>
          </h2>
        </button> */}

        <div className="mt-4 flex max-w-5xl flex-wrap items-center justify-center sm:w-full">
          {stock
            .map((item) => (
              <span key={item.id} className="flex flex-row">
                <input
                  className="mt-2 mx-1 w-96 rounded-xl border p-4 text-left hover:text-blue-600 focus:text-blue-600"
                  value={item.properties.stock_name?.title[0]?.text.content}
                  onChange={(e) => handleName(item.id, e.target.value)}
                />
                <input
                  className="mt-2 mx-1 w-96 rounded-xl border p-4 text-left hover:text-blue-600 focus:text-blue-600"
                  type="number"
                  value={item.properties?.Stock_Number?.number}
                  onChange={(e) => handleNumber(item.id, e.target.value)}
                />
                <input
                  type="checkbox"
                  className=" checked:bg-blue-500 mt-4 mx-1 p-4"
                  checked={item.properties.Checkbox.checkbox}
                  onChange={(e) => {
                    onToggle(item.id, e.target.checked);
                  }}
                />
                <button
                  onClick={() =>
                    handleSubmit(
                      item.id,
                      item.properties.stock_name?.title[0]?.text.content,
                      item.properties?.Stock_Number?.number,
                      item.properties.Checkbox.checkbox
                    )
                  }
                  className="mt-2 ml-4 rounded-xl border p-4 bg-slate-100"
                >
                  Apply to Notion
                </button>
              </span>
            ))
            .reverse()}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const notion = new Client({
    auth: process.env.NOTION_SECRET_KEY,
  });
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  return {
    props: { data: response.results },
  };
}

// export async function getServerSideProps(resolvedUrl) {
//   try {
//     const code = resolvedUrl.query.code;
//     const res = await fetch("https://api.notion.com/v1/oauth/token", {
//       method: "post",
//       headers: new Headers({
//         Authorization:
//           "Basic" +
//           (process.env.notionClientID + ":" + process.env.notionClientSecret),
//         "Content-Type": "application/json",
//       }),
//       body: JSON.stringify({
//         grant_type: "authorization_code",
//         code: code,
//         redirect_uri: "http://localhost:3000",
//       }),
//     });

//     const response = await res.json();
//     console.log(response);

//     return { props: { response } };
//   } catch (error) {
//     console.log(error);
//   }
// }

// export function notionCallback() {
//   const router = useRouter();
//   const { code } = router.query;

//   useEffect(() => {
//     if (code) getAccessToken(code);
//   }, [code]);

//   return <p>Loading...</p>;
// }

// export async function getAccessToken(code) {
//   fetch("https://api.notion.com/v1/oauth/token", {
//     method: "post",
//     auth: {
//       userName: process.env.notionClientID,
//       password: process.env.notionClientSecret,
//     },
//     headers: { "Content-Type": "application/json" },
//     data: { code, grant_type: "authorization_code" },
//   });
// }
