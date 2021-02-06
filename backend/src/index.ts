import * as WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 3030 });

/* wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // client.send(data);
      }
    });
    console.log(data);
    // ws.send(JSON.stringify({ name: 'BOT', text: 'Affirmative' }));
  });
}); */

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
