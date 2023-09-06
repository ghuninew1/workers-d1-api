export let htmltmp = (request) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#000">
<link
rel="icon"
type="image/png"
href="https://raw.githubusercontent.com/ghuninew1/ghuninew1/main/img/favicon.png"
/>
<link
rel="apple-touch-icon"
type="image/x-icon"
href="https://raw.githubusercontent.com/ghuninew1/ghuninew1/main/img/favicon.ico"
/>
<title>GhuniNew</title>
<style>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
h1{
    font-size: 20px;
}
body{

    place-items: center;
    place-content: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 13px;

}
a{
    text-decoration: none;
    list-style: none;
    color: #000;
    text-align: start;
}
a:hover{
    color: red;
    font-weight: bold;
    censor: pointer;
}
p{
    padding: 0px;
    margin: 3px;
}
</style>
</head>
<body>
    <h1><a href="/">GhuniNew</a></h1>
    <p>Time : ${new Date().toLocaleString(`th-TH`)}</p>
    <p>ip_cf : ${request.headers.get("cf-connecting-ip")}</p>
    <p>url : <a href=${request.url}>${request.url}</a></p>
    <p>url : <a href=${request.url}api>${request.url}api</a></p>
    <p>url : <a href=${request.url}api/data>${request.url}api/data</a></p>
    <p>url : <a href=${request.url}ping >${request.url}ping</a></p>
    <p>url : <a href=${request.url}ip >${request.url}ip/?IP</a></p>
    <p>url : <a href=${request.url}who >${request.url}who</a></p>
    <p>ws : <a href="/ws">${request.url}ws</a></p>
    <p>timezone : ${request.cf.timezone}</p>
    <p>colo : ${request.cf.colo}</p>
    <p>city : ${request.cf.city}</p>
    <p>country : ${request.cf.country}</p>
    <p>as:asn:pos : ${request.cf.asOrganization} : ${request.cf.asn} : ${
  request.cf.postalCode
}</p>
    <p>lati:longi : ${request.cf.latitude} : ${request.cf.longitude}</p>
    <p>httpProtocol : ${request.cf.httpProtocol}</p>
    <p>user-agent : ${request.headers.get(`user-agent`)}</p>
</body>
</html>
`;
