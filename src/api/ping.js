import heaDer from '../utils/header';

export default {
  async fetch(request, env) {
    return await handleRequest(request)
  }
}

async function handleRequest(request) {
  // get ip and port from request params
  const {
    searchParams
  } = new URL(request.url)
  let ip = searchParams.get('ip');
  let port = null;
  if (ip?.includes(':')) {
    const split = ip.split(':');
    ip = split[0];
    port = split[1];
  } else {
    port = searchParams.get('port');
  }
  const originalHostname = new URL(request.url).hostname;
  if (!ip || !port) {
    return new Response(`ip or port not found, usage: https://${originalHostname}?ip=127.0.0.1&port=80`, {
      status: 400,
      headers: heaDer,
    });
  }
  // ping the ip and port and return latency
  const latency = await ping(ip, port);

  const reponse = {
    latency: latency,
  }

  return new Response(JSON.stringify(reponse), {
    headers: heaDer,
  });
}

async function ping(ip, port) {
  try {
    // ping the ip and port and return latency

    const startTime = Date.now();
    console.log('Pinging', ip, port);
    //ping by making a request to the ip and port
    const reponse = await fetch(`http://${ip}:${port}`);

    if(reponse.status !== 200) {
      return 9999;
    } else {
    // get the response time
      const end = Date.now();
      console.log('Pinged in', end - startTime, 'ms');
    // return the latency
      return end - startTime;
    }
  } catch (e) {
    console.log(e);
    return 9999;
  }
}