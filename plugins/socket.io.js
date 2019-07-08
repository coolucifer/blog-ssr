import io from 'socket.io-client';

export const socket = io(process.env.WS_URL, {
  query: {
    room: 'default',
    userId: `client_${Math.random()}`,
  },
  // 直接使用websocket方式传输, 而不是由http升级
  transports: ['websocket'],
});

export default async ({ store }) => {
  await socket.on('connect', () => {
    // how can i update socketId here?
    store.commit('socket/updateSocketId', socket.id);
    console.log('socket connected! ', store.getters['socket/socketId']);
  });
};
