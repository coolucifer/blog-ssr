<!-- 人类的本质是复读机 -->
<template>
  <div class="repeater">
    <h1>人类的本质是复读机</h1>
    <div class="repeater-body">
      <el-form @submit.native.prevent="submit">
        <el-form-item label="输入: ">
          <el-input v-model="sendMsg" placeholder="请输入消息">
            <el-button slot="append" @click="submit">
              发送
            </el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="logs">
        聊天记录:
        <div v-for="(item, index) in msgList" :key="index">
          {{ item.from }}: {{ item.msg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'blog',
  components: {},
  data() {
    return {
      sendMsg: '',
      msgList: [],
    };
  },
  sockets: {
    connect() {
      console.log('----- socket connected -----');
    },
    // this method was fired by the socket server. eg: io.emit("res", data)
    res(data) {
      console.log('server fired method >res<, data: ', data);
    },
    online(socket) {
      console.log('welcome to room: ', socket.id);
    },
    reply(msg) {
      console.log('reply: ', msg);
      this.msgList.push({
        from: 'server',
        to: 'me',
        msg,
      });
    },
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submit() {
      const { sendMsg } = this;
      if (!sendMsg) {
        this.$message.warning('请输入内容');
        return;
      }
      this.$socket.emit('message', this.sendMsg);
      console.log('form submit');
      this.msgList.push({
        from: 'me',
        to: 'server',
        msg: this.sendMsg,
      });
      this.sendMsg = '';
    },
  },
};

</script>
<style lang="scss">
.repeater {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  min-height: calc(100vh - 100px);
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .el-input-group__append {
    .el-button {
      &:hover {
        border-color: transparent;
        color: inherit;
      }
    }
  }
}
</style>
