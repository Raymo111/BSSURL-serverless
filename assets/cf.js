addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function readRequestBody(request) {
  const { headers } = request
  const contentType = headers.get('content-type')
  if (contentType.includes('application/json')) {
    const body = await request.json()
    return JSON.stringify(body)
  } else if (contentType.includes('application/text')) {
    const body = await request.text()
    return body
  } else if (contentType.includes('text/html')) {
    const body = await request.text()
    return body
  } else if (contentType.includes('form')) {
    const formData = await request.formData()
    let body = {}
    for (let entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }
    return JSON.stringify(body)
  } else {
    let myBlob = await request.blob()
    var objectURL = URL.createObjectURL(myBlob)
    return objectURL
  }
}

function validateURL(url) {
  var validatorRegex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return validatorRegex.test(url);
}

async function handleRequest(request) {
  try {
    let body = JSON.parse(await readRequestBody(request));
    if (body.type === "GET") {
      let result = await fetch(endpoint + "/" + body.slug, {
        headers: {
          'Content-type': 'application/json'
        },
        method: 'GET'
      });
      let res = JSON.parse(await readRequestBody(result));
      return new Response(JSON.stringify(res.result), { status: 200 });
    } else if (body.type === "POST") {
      let data = {
        "url": body.url,
        "data": body.data
      };
      if (validateURL(body.url)) {
        let result = await fetch(endpoint + "/" + body.slug, {
          headers: {
            'Content-type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(data)
        });
        let res = await readRequestBody(result);
        return new Response(res, { status: 200 });
      } else {
        return new Response("Invalid long URL.", { status: 502 });
      }
    }
  } catch (e) {
    return new Response(e, { status: 501 });
  }
}
