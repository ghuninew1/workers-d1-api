const html = `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#000">

  <title>GhuniNew</title>

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

<main class="info">
<span class=status>
<p >WebSockets</p>&nbsp;
<span id="data"></span>&nbsp;
<span id="status"></span>
</span>

    <div class="info">
      <p id="num">num</p>
      <p id="error" style="color: red;"></p>


    </div>
    <div >
      <button id="click">Click</button>
      <button id="unknown">unknown</button>

      <button id="close">Close</button>
    </div>
      <section>
        <ul id="events"></ul>
      </section>
</main>

<script>
  let ws

  async function websocket(url) {
    ws = new WebSocket(url)

    if (!ws) {
      throw new Error("server didn't accept ws")
    }

    ws.addEventListener("open", () => {
      console.log('Opened websocket')
      updateCount(0)
      document.querySelector("#data").innerText = "online"
      document.querySelector("#status").classList.add("online")
    })

    ws.addEventListener("message", ({ data }) => {
      const { count, tz, error } = JSON.parse(data)
      addNewEvent(data)
      if (error) {
        setErrorMessage(error)
      } else {
        setErrorMessage()
        updateCount(count)
      }
    })

    ws.addEventListener("close", () => {
      console.log('Closed websocket')

      const list = document.querySelector("#events")
      list.innerText = ""
      updateCount(0)
      setErrorMessage()
      document.querySelector("#data").innerText = "offline"
      document.querySelector("#status").classList.add("offline")
      document.querySelector("#status").classList.remove("online")
    })
  }

  const url = new URL(window.location)
  url.protocol = location.protocol.replace("http", "ws")
  url.pathname = "/ws/"
  websocket(url)

  document.querySelector("#click").addEventListener("click", () => {
    ws.send("CLICK")
  })

  const updateCount = (count) => {
    document.querySelector("#num").innerText = count
  }

  const addNewEvent = (data) => {
    const list = document.querySelector("#events")
    const item = document.createElement("li")
    item.innerText = data
    list.prepend(item)
  }

  const closeConnection = () => ws.close()

  document.querySelector("#close").addEventListener("click", closeConnection)
  document.querySelector("#unknown").addEventListener("click", () => ws.send("HUH"))

  const setErrorMessage = message => {
    document.querySelector("#error").innerHTML = message ? message : ""
  }
</script>
`;

export default () => {
  return new Response(html, {
    headers: {
      "Content-type": "text/html; charset=utf-8",
    },
  });
};
