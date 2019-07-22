export const state = () => ({
  socketUserId: '',
  socketNickname: '',
});

export const getters = {
  socketUserId: state => state.socketUserId,
  socketNickname: state => state.socketNickname,
};

export const mutations = {
  updateSocketUserId(state, id) {
    state.socketUserId = id;
  },
  updateSocketNickname(state, socketNickname) {
    state.socketNickname = socketNickname;
  },
};
