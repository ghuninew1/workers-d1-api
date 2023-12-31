const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000" />
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
    <link
      rel="manifest"
      href="https://raw.githubusercontent.com/ghuninew1/ghuninew1/main/img/manifest.json"
    />
    <title>GhuniNew</title>
    <script
      src="https://unpkg.com/react@18/umd/react.development.js"
      crossorigin
    ></script>
    <script
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
      crossorigin
    ></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
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

      li {
        list-style: none;
      }

      .info {
        text-align: center;
        padding: 10px;
        color: gray;
        position: relative;
        margin: 0 auto;
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

      .info .online {
        color: green;
      }

      .info .offline {
        color: red;
      }

      section {
        margin: 0 auto;
        align-items: center;
      }

      button {
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

      button:last-child {
        background-color: #dd5608;
        color: #000;
      }

      button:hover {
        background-color: transparent;
        outline: 3px solid #dd5608;
        color: #000;
      }

      .status {
        align-items: center;
        text-align: center;
        padding: 0;
        margin: 5px;
        font-size: 20px;
        font-weight: 700;
      }

      .event {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 5px;
        padding: 10px;
      }
    </style>
  </head>

  <body>
  <div class="info">
  <h1 class={classNames}>WebSockets</h1>
  <div>
    <span id="date">{data}</span>
    <br></br>
    <span>{connect} </span>
    <span id="res"></span>
    <span id="status" class={classNames} />
    <section>{events}</section>
  </div>
  <div class="info">
  <div id="mydiv"></div>
  </div>
</div>
    <script type="text/babel">

      const container = document.getElementById("mydiv");
      const root = ReactDOM.createRoot(container);
      root.render(<App />);

      function App() {
        const [count, setCount] = React.useState(0);
        const [error, setErrorMessage] = React.useState();
        const [events, setEvents] = React.useState([]);
        const [data, setData] = React.useState("");
        const [status, setStatus] = React.useState("offline");
        const [connect, setConnect] = React.useState("Connecting");
        // let ws = null;
        let ws;
        const url = new URL(window.location);
        url.protocol = location.protocol.replace("http", "ws");
        url.pathname = "/ws/";

        ws = new WebSocket(url);

        React.useEffect(() => {

        ws.addEventListener("open", async () => {
          console.log("Opened websocket");
          setStatus("online");
          setConnect("Connected");
          return;
        });
        }, []);

        ws.addEventListener("message", async ({ data }) => {
          const { time, tasks, error } = JSON.parse(data);
          document.getElementById("res").innerText = Number(time).toFixed(2) + "ms";
          console.log("Received message", data);
          dataSetitem(data);
          return;
        });

        ws.addEventListener("error", async (error) => {
          console.log("Error on websocket", error);
        });

        ws.addEventListener("close", () => {
            console.log("Closed websocket");
            setStatus("offline");
            setConnect("Disconnected");
          });

        const dataSetitem = (data) => {
          setEvents(data);
        };

        function handleClose() {
          ws.close();

          ws = null;
        };

        const classNames = status === "online" ? "online" : "offline";
        return (
          <div className="info">
            <h1 className={classNames}>WebSockets</h1>
            <div>
              <span id="date">{data}</span>
              <br></br>
              <span>{connect} </span>
              <span id="res"></span>
              <span id="status" className={classNames} />
              <section>{events}</section>
            </div>
            <div className="info">
              <button onClick={() => ws.send("CLICK")}>Click</button>
              <button onClick={() => ws.send("GETDB")}>Click</button>
              <button onClick={handleClose}>Close</button>
            </div>
          </div>
        );
      };
    </script>
  </body>
</html>

`;

export default () => {
  return new Response(html, {
    headers: {
      "Content-type": "text/html; charset=utf-8",
    },
  });
};
