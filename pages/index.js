import Head from "next/head";

export default function Home() {
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
      </main>
    </div>
  );
}
