export const state = () => ({
  socketId: '',
});

export const getters = {
  socketId: state => state.socketId,
};

export const mutations = {
  updateSocketId(state, id) {
    state.socketId = id;
  },
};
