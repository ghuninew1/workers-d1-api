(function () {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const wsSendButton = document.querySelector('#wsSendButton');
  const logout = document.querySelector('#logout');
  const login = document.querySelector('#login');

  const rss = document.getElementById('rss');
  const heapTotal = document.getElementById('heapTotal');
  const heapUsed = document.getElementById('heapUsed');
  const external = document.getElementById('external');
  const user = document.getElementById('user');
  const system = document.getElementById('system');

  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }

  function handleResponse(response) {
    return response.ok
      ? response.json().then((data) => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'));
  }

  login.onclick = function () {
    fetch('/login', { method: 'POST', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch(function (err) {
        showMessage(err.message);
      });
  };

  logout.onclick = function () {
    fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch(function (err) {
        showMessage(err.message);
      });
  };

  let ws;

  wsButton.onclick = function () {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://${location.host}`);
    ws.onerror = function () {
      showMessage('WebSocket error');
    };

    showMessage(`WebSocket connection to ${ws.url} `);
    
    ws.onclose = function () {
      showMessage('WebSocket connection closed');
      ws = null;
    };
    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      
      rss.textContent = data.memory.rss * 0.000001 + ' MB';
      heapTotal.textContent = Number(data.memory.heapTotal).toFixed(2)
      heapUsed.textContent = data.memory.heapUsed * 0.000001 + ' MB';
      external.textContent = data.memory.external * 0.000001 + ' MB';
      user.textContent = data.cpus.user 
      system.textContent = data.cpus.system 
    }

  };



  wsSendButton.onclick = function () {
    
    if (!ws) {
      showMessage('No WebSocket connection');
      return;
    }
    

    
    ws.send(Date.now());

    const message = JSON.parse(event.data);

    // showMessage(`Roundtrip time: ${message.time} ms : ip ${message.ip}`);
    // // setInterval(() => {
    // document.getElementById('time').innerHTML = message.time +' ms';
    // }, 5000);
  };
})();
