export default function template() {
	const indexHtml = `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#000">
  <link rel="icon" type="image/png" href="https://raw.githubusercontent.com/ghuninew1/ghuninew1/main/img/favicon.png" />
  <link rel="apple-touch-icon" type="image/x-icon"
    href="https://raw.githubusercontent.com/ghuninew1/ghuninew1/main/img/favicon.ico" />
  <link rel="manifest" href="https://raw.githubusercontent.com/ghuninew1/ghuninew1/main/img/manifest.json" />
  <title>GhuniNew</title>
<!--
  <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>  -->
  
  <style>
  html,
body {
	place-items: center center;
	min-height: 100vh;
  margin: 0;
  padding: 0;
  font-family: tahoma, sans-serif;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

h1 {
	text-align: center;
}
main{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.info {
	text-align: center;
	padding: 10px;
	color: gray;
  position: relative;
  margin: 0 auto;
}

.info #dolocation {
	display: block;
}

.info #status {
	height: 20px;
	width: 20px;
	background-color: #bbb;
	border-radius: 50%;
	display: inline-block;
}

.info #status.online {
	background-color: green;
}

.info #status.offline {
	background-color: red;
}

section {
	margin: 0 auto;
	align-items: center;
}
button{
    background-color: #015e04;
    border: none;
    padding: 10px;
    margin: 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border-radius: 7px;
    cursor: pointer;
    color: #fff;
}
button:hover{
    background-color: transparent;
    outline: 3px solid #dd5608;
    color: #000;
}
.status{
  align-items: center;
  text-align: center;
  padding: 0;
  margin: 5px;
  font-size: 20px;
  font-weight: 700;
}
  </style>
</head>

<body>
<main class="info">
<span class=status>
<span id="data">WebSockets</span>&nbsp;
<span id="status"></span>
</span>
    <table>
    <thead>
      <tr>
        <th >Memory</th>
        <th >usage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td id="rss"></td>
      </tr>
      <tr>
        <td id="heapTotal"></td>
      </tr>
      <tr>
        <td id="heapUsed"></td>
      </tr>
      <tr>
        <td id="external"></td>
      </tr>
      <tr>
        <td id="user"></td>
      </tr>
      <tr>
        <td id="system"></td>
      </tr>
    </tbody>
  </table>
    <div class="info">
      <p id="num">num</p>
      <span id="data2">data2</span>
      <p id="error" style="color: red;"></p>

      <section>
        <ul id="events"></ul>
      </section>
    </div>
    <div >
      <button id="click">Click</button>
      <button id="clickun">Click un</button>
      <button id="close">Close</button>
    </div>
    <pre id="messages" style="height: 200px; overflow: scroll"></pre>

</main>
<script>

  let events = document.querySelector('#events');
  let close = document.querySelector('#close');
  
  let clickun = document.querySelector('#clickun');
  // let num = document.querySelector('#num');
  let status = document.querySelector('#status');
  let error = document.querySelector('#error');
  let messages = document.querySelector('#messages');
  let data = document.querySelector('#data');

  let rss = document.getElementById('rss');
  let heapTotal = document.getElementById('heapTotal');
  let heapUsed = document.getElementById('heapUsed');
  let external = document.getElementById('external');
  let user = document.getElementById('user');
  let system = document.getElementById('system');

  let ws

  const url = new URL(window.location)
  url.protocol = location.protocol.replace("http", "ws")
  url.pathname = "/ws/"
  
 
  websocket(url)
  async function websocket(url) {
    ws = new WebSocket(url)
    if (!ws) {
      throw new Error("server didn't accept ws")
    }

    ws.addEventListener("open", () => {
      console.log('Opened websocket')
      status.classList.add("online")
      data.innerText = "Connected"
      data.style.color = "green"
      
    })

    ws.addEventListener("message", (data) => {
      
      const { count, tz, error } = JSON.parse(data)
      messages.innerText = JSON.stringify({ count, tz, error }, null, 2)
      document.querySelector('#num').innerText = data.data
      console.log(data)
      // if (error) {
      //   console.log(error)
      // } else {
      // }
      
    })

    let clickButton = document.getElementById('click');
    clickButton.addEventListener('click', () => { ws.send('CLICK')});

    ws.addEventListener("close", () => {
      console.log('Closed websocket')
      status.classList.remove("online")
      status.classList.add("offline")
      data.innerText = "Disconnected"
      data.style.color = "red"
    })
  
  }
  clickun.onclick = (data) => {
    ws.send(new Date())
    console.log(data)
  }

  close.addEventListener('click', () => {
    ws.close()
    ws = null
  })


  const setErrorMessage = message => {
    error.innerText = message || ""
  }


  const dataWss = (event) => {
    const data = JSON.parse(event.data);
    rss.textContent = data.memory.rss * 0.000001 + ' MB';
    heapTotal.textContent = data.memory.heapTotal * 0.000001 + ' MB';
    heapUsed.textContent = data.memory.heapUsed * 0.000001 + ' MB';
    external.textContent = data.memory.external * 0.000001 + ' MB';
    user.textContent = data.cpus.user 
    system.textContent = data.cpus.system 

    // console.log(data);
  };

</script>
  
</body>

</html>`;

	return new Response(indexHtml, {
		headers: {
			'content-type': 'text/html, charset=utf-8',
			'Access-Control-Allow-Origin': '*',
		},
	});
}
