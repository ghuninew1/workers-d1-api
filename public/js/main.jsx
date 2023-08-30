const Main = () => <App />;

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Main />);

const App = () => {
	const [data, setData] = React.useState();
	const [count, setCount] = React.useState(0);
	// const socket = new WebSocket( url )

	return (
		<>
			<h1>WebSockets</h1>
			<div className="info">
				<h1>{count}</h1>
				<p id="date">date</p>
				<span id="ping">... connecting</span>
				<span id="status"></span>
				<section></section>
			</div>
			<div className="info">
				<button onClick={() => setCount(count + 1)}>Click +</button>
				<button onClick={() => setCount(count - 1)}>Click -</button>
				{/* <WebsocketHandle /> */}
			</div>
		</>
	);
};

const WebsocketHandle = ()=> {
	
	// const url = new URL( window.location )
	//   url.protocol = location.protocol.replace( "http", "ws" )
	//   url.pathname = "/ws/"
	// let ws = new WebSocket(url)

	// ws.addEventListener( "open", () => onOpen() );

	// ws.addEventListener('message', ({ data }) => {
	// 	const { count, tz, error, res, timeSent } = JSON.parse(data);
		// addNewEvent( data )
		// if ( error ) {
		// setErrorMessage( error )
		// } else {
		// setErrorMessage()
		// updateCount( count )
		// getPing( data );
		// }
	// });

	// ws.addEventListener('close', () => {
	// 	console.log('Closed websocket');

		// const list = document.querySelector( "#events" )
		// list.innerText = ""
		// updateCount( 0 )
		// setErrorMessage()
	// });

	// const closeConnection = () => {
	// 	ws.close();
		// onClose()
	// };

	return (
	  <>
	  <button id="click" onClick={()=>ws.send("CLICK")}>Click +</button>
	  <button id="clickdown" onClick={()=>ws.send("CLICKDOWN")}>Click -</button>
	  <button id="close" >Close</button>
	  </>
	)
}
