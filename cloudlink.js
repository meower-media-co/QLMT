class Cloudlink {
  constructor(server) {
    this.events = {};
    this.ws = new WebSocket(server);
    this._run()
  }
  send(data) {
    this.ws.send(JSON.stringify(data));
  }
  on(event, cb) {
    if (typeof this.events[event] !== 'object') this.events[event] = [];
    this.events[event].push(cb);
  }
  emit(event, data) {
    if (typeof this.events[event] !== 'object') return;
    this.events[event].forEach((cb) => cb(data));
  }
  disconnect() {
    this.ws.close();
  }
  _run() {
    this.ws.onopen = async () => {
      this.send({
        cmd: 'direct',
        val: {
          cmd: 'ip',
          val: await (await fetch('https://api.meower.org/ip')).text(),
        },
      });
      this.send({
        cmd: 'direct',
        val: 'meower',
      });
      this.send({
        cmd: 'direct',
        val: { cmd: 'type', val: 'js' },
      });
      this.emit('connected');
    };
    this.ws.onmessage = (socketdata) => {
      var data = JSON.parse(socketdata.data);
      this.emit('message', data);
    };
    this.ws.onclose = () => {
      console.log('QLMT: disconnected from server');
      console.log('QLMT: reconnecting...');
      this.ws = new WebSocket(this.ws.url);
      this._run();
    };
    this.ws.onerror = (e) => {
      this.emit('error', e);
    };
  }
}
export default Cloudlink;

