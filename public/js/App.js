const App = () => {


  // const socket = new WebSocket( url )

  return (
    <div>
      <h1>WebSockets</h1>
      <div className="info">
        <p id="date">date</p>
        <span id="ping">... connecting</span>
        <span id="status"></span>
        <section>
        </section>
      </div>
      <div className="info">
        <button id="click" onClick={ () => ws.send( "CLICK" ) }>Click +</button>
        <button id="clickdown" onClick={ () => ws.send( "CLICKDOWN" ) }>Click -</button>
        <button id="close" >Close</button>
      </div>
    </div>
  )
}



async function WebsocketHandle() {
  const [data,setData] = ReactDOM.useState()
  // const url = new URL( window.location )
  //   url.protocol = location.protocol.replace( "http", "ws" )
  //   url.pathname = "/ws/"
  // let ws = new WebSocket(url)


  // ws.addEventListener( "open", () => onOpen() );

  ws.addEventListener( "message", ( { data } ) => {

    const { count, tz, error, res, timeSent } = JSON.parse( data )
    // addNewEvent( data )
    // if ( error ) {
    // setErrorMessage( error )
    // } else {
    // setErrorMessage()
    // updateCount( count )
    // getPing( data );
    // }

  } )

  ws.addEventListener( "close", () => {
    console.log( 'Closed websocket' )

    // const list = document.querySelector( "#events" )
    // list.innerText = ""
    // updateCount( 0 )
    // setErrorMessage()
  } );


  const closeConnection = () => {
    ws.close()
    // onClose()
  }

  // return (
  //   <>
  //   <button id="click" onClick={()=>ws.send("CLICK")}>Click +</button>
  //   <button id="clickdown" onClick={()=>ws.send("CLICKDOWN")}>Click -</button>
  //   <button id="close" onClick={closeConnection}>Close</button>
  //   </>
  // )
}
