import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function AccessToken({ response }) {
  const router = useRouter();
  console.log(response);
  if (response?.access_token !== undefined) {
    useEffect(() => {
      // saving secret_token in localStorage to access it from clientSide
      localStorage.setItem("secret", response.access_token);
      // saving secret_token in cookies to access it from both clientSide and server
      Cookies.set("secret", JSON.stringify(response.access_token));
      Swal.fire({
        title: "Plugin Added Successfully",
        text: "do you want to view the database now?",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/sheet");
        }
      });
    }, [response.access_token]);
  }
  return (
    <div>
      <button>
        <h2 className="text-2xl text-rose-400 font-bold rounded-xl border p-4 mt-4 border-rose-400 hover:text-rose-500 hover:bg-rose-100">
          <a href="https://api.notion.com/v1/oauth/authorize?client_id=19ab6125-8554-4494-a839-53c4f6868644&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Faccesstoken">
            + notion
          </a>
        </h2>
      </button>
    </div>
  );
}

export default AccessToken;

export async function getServerSideProps(resolvedUrl) {
  try {
    // extracting the code from url parameter
    const code = resolvedUrl.query.code;
    // sending post request to notion for secret_token
    const res = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "post",
      headers: new Headers({
        // with base64 encoded oAuth clientID and oAuth client secret
        Authorization: `Basic ${Buffer.from(
          `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        grant_type: "authorization_code",
        // and with the redirected code form query parameter
        code: code,
        redirect_uri: "http://localhost:3000/accesstoken",
      }),
    });
    const response = await res.json();
    return { props: { response } };
  } catch (error) {
    console.log(error);
  }
}
