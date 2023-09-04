// import { Hono } from "hono";
// import { cors } from "hono/cors";
// import { etag } from "hono/etag";

// import { memo, Fragment } from "hono/jsx";
import { html } from "hono/html";

export default function handler(c) {
  // app.use("*", async (c, next) => {
  //   const start = Date.now();
  //   await next();
  //   const end = Date.now();
  //   c.res.headers.set("X-Response-Time", `${end - start} ms`);
  //   c.res.headers.set("Access-Allow-Origin", "*");
  //   c.res.headers.set("X-powered-By", `GhuniNew`);
  // });



  const Layout = ({ children, title }) => html` <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            place-items: center;
            font-family: Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            margin: 10px;
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
          .info {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

          }
          .info #status {
            height: 15px;
            width: 15px;
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
        </style>
      </head>
      <body>
        ${children}
    <script>
    let ws;

    async function websocket(url) {
      ws = new WebSocket(url);

      if (!ws) {
        throw new Error("server didn't accept ws");
      }



      ws.addEventListener("open", () => {
        console.log("Opened websocket");
        updateCount(0);
        // document.querySelector("#data").innerText = "online";
        // document.querySelector("#status").classList.add("online");
      });

      ws.addEventListener("message", ({ data }) => {
        const { count, tz, time, tasks, error } = JSON.parse(data);
        if (tasks) {
          addNewEvent(tasks);
          setErrorMessage();
        } else if (time) {
          setErrorMessage();
          updateCount(count);
          document.getElementById("res").innerText = time;
          document.getElementById("time").innerText = tz;
        }

        if (error) {
          setErrorMessage(error);
        }
      });

      ws.addEventListener("close", () => {
        console.log("Closed websocket");

        document.querySelector("#events").innerText = "";
        updateCount(0);
        setErrorMessage();
        document.querySelector("#data").innerText = "offline";
        document.querySelector("#status").classList.add("offline");
        document.querySelector("#status").classList.remove("online");
      });
    }

    const url = new URL(window.location);
    url.protocol = location.protocol.replace("http", "ws");
    url.pathname = "/ws/";
    websocket(url);

    // let btcClick = document.querySelector("#click");
    // let btcClickdown = document.querySelector("#clickdown");
    // let btcReset = document.querySelector("#reset");
    // let btcUnknown = document.querySelector("#unknown");
    // let btcClose = document.querySelector("#close");

    // btcClick.addEventListener("click", () => {
    //   ws.send(JSON.stringify({ data: "CLICK", time: new Date().getTime() }));
    // });

    // btcClickdown.addEventListener("click", () => {
    //   ws.send(
    //     JSON.stringify({ data: "CLICKDOWN", time: new Date().getTime() })
    //   );
    // });

    const updateCount = (count) => {
      document.querySelector("#num").innerText = count;
    };

    const addNewEvent = (result) => {
      //new Response data to json page new

      // if (list.children.length > 5) {
      //   list.children[5].remove();
      // }

      const list = document.getElementById("events");

      const item = document.createElement("li");


      item.innerText = JSON.stringify(result);
      list.prepend(item);
    };

    const closeConnection = () => ws.close();

    // btcReset.addEventListener("click", () => {
    //   ws.send(JSON.stringify({ data: "RESET", time: new Date().getTime() }));
    // });

    // btcClose.addEventListener("click", closeConnection);

    // btcUnknown.addEventListener("click", () => {
    //   const getdb = document.querySelector("#inputdb").value;
    //   ws.send(JSON.stringify({ data: "GETDB", getdb: getdb }));
    // });

    const setErrorMessage = (message) => {
      document.querySelector("#error").innerHTML = message ? message : "";
    };
    
         </script>
      </body>
    </html>`;

    
    
  const Content = () => (
    <Layout title={"test"}>
        
      
      <div class="info">
      <h1>WebSocKets</h1>
        <span id="data"> Connecting....  <span id="status"></span></span> 
       
        <span id="res">res</span>
        <span id="num">num</span>
      
      <div>
        <button id="click">Click+</button>
        <button id="clickdown">Click-</button>
        <button id="reset">reset</button>
        <button id="close">Close</button>
      </div>

      </div>

      <table style="width:50%" border="0">
        <tbody>
          <tr>
            <td>test</td>
            <td>test</td>
          </tr>
          <tr>
            <td>test</td>
            <td>test</td>
          </tr>
        </tbody>
      </table>

    </Layout>
  );


  return c.html(Content());
}



