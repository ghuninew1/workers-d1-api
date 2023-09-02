const heaDer = {
  "content-type": "application/json;charset=UTF-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  "Cache-Control": "max-age=60",
};

export default {
  async fetch(request) {
    return await handleRequest(request);
  },
};

async function handleRequest(request) {
  // get ip and port from request params
  const { searchParams } = new URL(request.url);
  let ip = searchParams.get("ip");
  let port;
  if (ip?.includes(":")) {
    const split = ip.split(":");
    ip = split[0];
    port = split[1];
  } else {
    port = searchParams.get("port");
  }
  const originalHostname = new URL(request.url).hostname;
  if (!ip || !port) {
    return new Response(
      `ip or port  ${request.url}?ip=127.0.0.1&port=80 || ${request.url}?ip=localhost:80`,
      {
        status: 400,
        headers: heaDer,
      }
    );
  }
  // ping the ip and port and return latency
  const latency = await ping(ip, port);

  const reponse = {
    ms: latency,
  };

  return new Response(JSON.stringify(reponse), {
    headers: heaDer,
  });
}

async function ping(ip, port) {
  try {
    // ping the ip and port and return latency

    const startTime = Date.now();
    // console.log('Pinging', ip, port);
    //ping by making a request to the ip and port
    const reponse = await fetch(`https://${ip}:${port}`, { headers: heaDer });

    if (reponse.status !== 200) {
      return new Response(`Error: ${reponse.status} ${reponse.statusText}`, {
        status: 400,
        headers: heaDer,
      });
    } else {
      // get the response time
      const end = Date.now();
      console.log(`Pinged in: ${ip}:${port}`, end - startTime, "ms");
      // return the latency
      return end - startTime;
    }
  } catch (err) {
    console.log(err);
    return new Response(err.message, { status: 500 });
  }
}
