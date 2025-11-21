
async function testAuthenticatedCall() {
  const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1NzMzYmJiZDgxOGFhNWRiMTk1MTk5Y2Q1NjhlNWQ2ODUxMzJkM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNjEyODQwNjQ5NTItNTM0dW82NXE3MWNoMDhrZmhzOGowN29vczkzdmhtdjAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNjEyODQwNjQ5NTItNTM0dW82NXE3MWNoMDhrZmhzOGowN29vczkzdmhtdjAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDU5MDIzNDYyODY2NTMyMzYwMjMiLCJlbWFpbCI6ImhhcnJ5dG9rMjFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ5Y2JWZXloOGtvdUNpeWxBVWwzOWxnIiwibmFtZSI6IkhhcndpbmRlciBTaW5naCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKcmVqUlNfSEZydnROX012RENheWNsSWpTM2ZTaEVaZXRucnpzRjRmcWVkVm9EWVdwRz1zOTYtYyIsImdpdmVuX25hbWUiOiJIYXJ3aW5kZXIiLCJmYW1pbHlfbmFtZSI6IlNpbmdoIiwiaWF0IjoxNzYzNzEyMDg4LCJleHAiOjE3NjM3MTU2ODh9.zB7md3---DJSFOCjMlg83ecHFiiErFrrFmu3Mx5rqJPGhndIPg7mU6GkOzgmk1-cM0k0BcMM3_QCLQcgYlBp861a3z5RrIODUqEaCQXn0uuAf_3jGBhpKuios082t2fFwyeunp3gDCH_NRItmzyKbS54Xq-5qO68D5_8X4Grqj5qWDGkbtgGdaHzp5YoOFg0wCTX0xvXGz6iWi2eZ_YiEgG0Ns2_dz0MM1fmQPcawQr7g54swsvDDbNdl0FuwAw4jX4pev0JJTmQOkDyBn2Z37z8LMDJwmFenYHOd-5JWXUEVFRQklNgdVJV_S_FYJDdhSC2wRQpBuOsIIbOXyISJQ";

  console.log("Testing authenticated MCP call with your token...");

  try {
    const response = await fetch("http://localhost:3000/api/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json, text/event-stream"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "roll_dice",
          arguments: {
            sides: 20
          }
        }
      })
    });

    const text = await response.text();
    console.log("\nResponse Status:", response.status);
    console.log("Response Content-Type:", response.headers.get("content-type"));
    console.log("Response Body:\n", text);

    try {
      const data = JSON.parse(text);
      if (response.ok) {
        console.log("\n✅ SUCCESS! Server response:");
        console.log(JSON.stringify(data, null, 2));
        
        if (data.result && data.result.content) {
          console.log("\nMessage content:");
          console.log(data.result.content[0].text);
        }
      } else {
        console.log("\n❌ FAILED. Server response:");
        console.log(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.log("\n⚠️ Response is not JSON. It might be SSE.");
    }
  } catch (error) {
    console.error("\n❌ Error making request:", error.message);
  }
}

testAuthenticatedCall();
