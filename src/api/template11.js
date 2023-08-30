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
	display: grid;
	place-items: center center;
	min-height: 100vh;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

h1 {
	text-align: center;
}

.info {
	text-align: center;
	padding: 10px;
	color: gray;
}

.info #dolocation {
	display: block;
}

.info #status {
	height: 10px;
	width: 10px;
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
  </style>
</head>

<body>
  <div id="root"></div>

  <script type="text/jsx">
  const Main = () => <App />;

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Main />);

const url = new URL( window.location )
    url.protocol = location.protocol.replace( "http", "ws" )
    url.pathname = "/ws/"
	let ws = new WebSocket( url )

const App = () => {
	const [data, setData] = React.useState('... connecting ');
	const [dataWs, setDataWs] = React.useState([]);
  const [classNam, setClassNam] = React.useState('');
  const [counts, setCounts] = React.useState(0);
  

  ws.addEventListener( "open", () => onOpen() );

  ws.addEventListener( "message", (datas) => {
    const { data, count,tz } = JSON.parse( datas.data )
    setDataWs( datas.data  )
    setCounts( count )
    console.log( datas )

  });

  ws.addEventListener( "close", () => {
    setClassNam("offline")
    setData( "Closed websocket " )
    console.log( 'Closed websocket' )
  });

  const onOpen = () => {
    console.log( "Connected to server" );
    setClassNam("online")
    setData( "Connected  " );
  }

	return (
		<>
			<h1>WebSockets</h1>
      <table>
      <thead>
        <tr>
          <th >Memory</th>
          <th >usage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>RSS</td>
          <td id="rss"></td>
        </tr>
        <tr>
          <td>Heap total</td>
          <td id="heapTotal"></td>
        </tr>
        <tr>
          <td>Heap used</td>
          <td id="heapUsed"></td>
        </tr>
        <tr>
          <td>External</td>
          <td id="external"></td>
        </tr>
        <tr>
          <td>User</td>
          <td id="user"></td>
        </tr>
        <tr>
          <td>System</td>
          <td id="system"></td>
        </tr>
      </tbody>
    </table>
			<div className="info">
				<p id="date">{counts}</p>
				<span >{data}</span>
				<span id="status"className={classNam}></span>
        
				<section>{dataWs}</section>
			</div>
			<div className="info">
				<button onClick={() => setClassNam("offline")}>Click +</button>
				<button onClick={() => setData(data - 1)}>Click -</button>
        <button onClick={() => ws.close()}>Close</button>
        <button onClick={() => ws.send("CLICK")}>Send</button>
        <button onClick={() => ws.send("CLICKD")}>Send</button>
        <button onClick={() => ws.send("PING")}>Ping</button>
			</div>
		</>
	);
};



</script>
</body>

</html>`;

	return new Response(indexHtml, {
		headers: {
			'content-type': 'text/html',
			'Access-Control-Allow-Origin': '*',
		},
	});
}
const Main = () => <App />;

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Main />);

const url = new URL( window.location )
    url.protocol = location.protocol.replace( "http", "ws" )
    url.pathname = "/ws/"
	let ws = new WebSocket( url )

const App = () => {
	const [data, setData] = React.useState('... connecting ');
	const [dataWs, setDataWs] = React.useState([]);
  const [classNam, setClassNam] = React.useState('');
  const [counts, setCounts] = React.useState(0);
  

  ws.addEventListener( "open", () => onOpen() );

  ws.addEventListener( "message", (datas) => {
    const { data, count,tz } = JSON.parse( datas.data )
    setDataWs( datas.data  )
    setCounts( count )
    console.log( datas )

  });

  ws.addEventListener( "close", () => {
    setClassNam("offline")
    setData( "Closed websocket " )
    console.log( 'Closed websocket' )
  });

  const onOpen = () => {
    console.log( "Connected to server" );
    setClassNam("online")
    setData( "Connected  " );
  }

	return (
		<>
			<h1>WebSockets</h1>
      <table>
      <thead>
        <tr>
          <th >Memory</th>
          <th >usage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>RSS</td>
          <td id="rss"></td>
        </tr>
        <tr>
          <td>Heap total</td>
          <td id="heapTotal"></td>
        </tr>
        <tr>
          <td>Heap used</td>
          <td id="heapUsed"></td>
        </tr>
        <tr>
          <td>External</td>
          <td id="external"></td>
        </tr>
        <tr>
          <td>User</td>
          <td id="user"></td>
        </tr>
        <tr>
          <td>System</td>
          <td id="system"></td>
        </tr>
      </tbody>
    </table>
			<div className="info">
				<p id="date">{counts}</p>
				<span >{data}</span>
				<span id="status"className={classNam}></span>
        
				<section>{dataWs}</section>
			</div>
			<div className="info">
				<button onClick={() => setClassNam("offline")}>Click +</button>
				<button onClick={() => setData(data - 1)}>Click -</button>
        <button onClick={() => ws.close()}>Close</button>
        <button onClick={() => ws.send("CLICK")}>Send</button>
        <button onClick={() => ws.send("CLICKD")}>Send</button>
        <button onClick={() => ws.send("PING")}>Ping</button>
			</div>
		</>
	);
};



