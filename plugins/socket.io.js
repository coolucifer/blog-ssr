import io from 'socket.io-client';

function SocketIO() {
  this.connect = nickname => new Promise(resolve => {
    const socket = io(process.env.WS_URL,
      {
        query: {
          room: 'default',
          userId: `client_${Math.random()}`,
          nickname,
        },
        // 直接使用websocket方式传输, 而不是由http升级
        transports: ['websocket'],
      });
    // __proto__是内部属性, 未纳入ES6标准, 不可以直接设置. 要用Object.setPrototypeOf()代替
    Object.setPrototypeOf(this, socket);
    socket.on('connect', () => {
      console.log('socket connect');
      resolve();
    });
  });
}

export default new SocketIO();
