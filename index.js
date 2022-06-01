import WebSocket from 'ws';
globalThis.WebSocket = WebSocket; // sigh, nodejs doesn't support websockets yet, aaaaaaaaaaaaaaaaaaaa
import Cloudlink from './cloudlink.js';
import { start } from 'repl';
import { inspect } from 'util';

inspect.defaultOptions.depth = 100;

console.log('loading QLMT: quick little meower terminal');

let cljs = new Cloudlink('wss://server.meower.org');

cljs.on('message', (data) => {
  console.log(data);
});

cljs.on('connected', async () => {
  console.log('QLMT: connected to server');
  start({
    prompt: 'QLMT > ',
    eval: (cmd) => {
      cmd = cmd.replace('\n', '');
      var args = cmd.split(' ');
      console.log(args)
      if (args[0] == 'login') {
        cljs.send({
          cmd: 'direct',
          val: {
            cmd: 'authpswd',
            val: {
              username: args[1],
              pswd: args[2],
            },
          },
        });
      } else {
        cljs.send(JSON.parse(cmd));
      }
    },
  });
});
