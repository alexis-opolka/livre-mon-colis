import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const separatorOfPath = "?path=";

  const path = request.url.split(separatorOfPath)[1].replace(/%2F/g, "/");
  console.log("Requested:", path);

  let headers: Headers;

  const response = await fetch("http://127.0.0.1:8000" + path, {
    method: "GET",
    cache: "default",
  })
    .then((response) => {
      const reader = response.body?.getReader();
      headers = response.headers;

      return new ReadableStream({
        start(controller) {
          return pump();
          function pump(): any {
            return reader?.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                return;
              }
              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return pump();
            });
          }
        },
      });
    })
    // Create a new response out of the stream
    .then((stream) => {
      return new NextResponse(stream, {
        headers: headers,
      });
    })
    .catch((err) => {
      console.error(
        `We couldn't proxy the request to '${path}' because of this error: ${err}`
      );
      return new NextResponse(null, { status: 500, statusText: err });
    });

  return response;
}

export async function POST(request: NextRequest) {

  const separatorOfPath = "?path=";
  const path = request.url.split(separatorOfPath)[1].replace(/%2F/g, "/");

  const requestBody = await request.json();

  console.log("Requested:", path, "with the following body:", requestBody);

  const response = await fetch("http://127.0.0.1:8000" + path, {
    method: "POST",
    cache: "default",
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      const reader = response.body?.getReader();
      return new ReadableStream({
        start(controller) {
          return pump();
          function pump(): any {
            return reader?.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                return;
              }
              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return pump();
            });
          }
        },
      });
    })
    // Create a new response out of the stream
    .then((stream) => {
      return new NextResponse(stream);
    })
    .catch((err) => {
      console.error(
        `We couldn't proxy the request to '${path}' because of this error: ${err}`
      );
      return new NextResponse(null, { status: 500, statusText: err });
    });

  return response;
}

