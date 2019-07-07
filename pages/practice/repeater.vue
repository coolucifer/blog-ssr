<!-- 人类的本质是复读机 -->
<template>
  <div class="repeater">
    <h1>人类的本质是复读机</h1>
    <div class="repeater-body">
      <el-form @submit.native.prevent="submit">
        <el-form-item>
          <h3 slot="label">
            输入:
          </h3>
          <el-input v-model="sendMsg" placeholder="请输入消息">
            <el-button slot="append" @click="submit">
              发送
            </el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <h3>聊天记录:</h3>
      <el-scrollbar ref="logScrollbar" class="logs">
        <chat-bubble
          v-for="(item, index) in msgList"
          :key="index"
          :data="item"
        >
        </chat-bubble>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import socket from '@/plugins/socket.io';
import ChatBubble from '@/components/practice/ChatBubble';

export default {
  layout: 'blog',
  components: {
    ChatBubble,
  },
  data() {
    return {
      sendMsg: '',
      msgList: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  beforeMount() {
    socket.on('reply', msg => {
      this.insertMsg({
        from: 'server',
        to: 'me',
        msg,
      });
    });
  },
  mounted() {},
  methods: {
    insertMsg({ from, msg }) {
      this.msgList.push({
        userInfo: {
          userName: from,
          avatar: '',
        },
        content: msg,
        timestamp: +new Date(),
      });
      this.$nextTick(() => {
        const wrap = document.querySelector('.logs .el-scrollbar__wrap');
        const view = document.querySelector('.logs .el-scrollbar__wrap .el-scrollbar__view');
        const bottomOffset = view.clientHeight - wrap.clientHeight;
        if (!wrap || wrap.scrollTop === bottomOffset) return;
        // scroll to bottom
        wrap.scrollTop = bottomOffset;
      });
    },
    submit() {
      const { sendMsg } = this;
      if (!sendMsg) {
        this.$message.warning('请输入内容');
        return;
      }
      socket.emit('message', this.sendMsg);
      console.log('form submit');
      this.insertMsg({
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 100px);
  padding: 10px;
  margin: 10px 0;
  min-height: calc(100vh - 100px);
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  h3 {
    font-size: 16px;
    color: #2c3e50;
  }
  .repeater-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .el-input-group__append {
    .el-button {
      &:hover {
        border-color: transparent;
        color: inherit;
      }
    }
  }
  .logs {
    flex-grow: 1;
    box-shadow: inset 0 2px 12px 0 rgba(0,0,0,.1);
  }
}
</style>
