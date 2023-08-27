import indexHtml from './htmltmp.html';


export default () => {
  return new Response(indexHtml, {
    headers: {
      'content-type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Expose-Headers': '*',
      'Cache-Control': 'max-age=1500',
     },

  });
}
