<!-- 人类的本质是复读机 -->
<template>
  <div class="repeater">
    <div class="main-area">
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
            :side="getMsgSide(item.client)"
          >
          </chat-bubble>
        </el-scrollbar>
      </div>
    </div>
    <el-card class="side-area">
      <span slot="header">在线列表</span>
    </el-card>
  </div>
</template>

<script>
import { socket } from '@/plugins/socket.io';
import ChatBubble from '@/components/practice/ChatBubble';
import { mapGetters } from 'vuex';

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
  computed: {
    ...mapGetters('socket', ['socketId']),
  },
  watch: {
    msgList() {
      this.$nextTick(() => {
        const wrap = document.querySelector('.logs .el-scrollbar__wrap');
        const view = document.querySelector('.logs .el-scrollbar__wrap .el-scrollbar__view');
        const bottomOffset = view.clientHeight - wrap.clientHeight;
        const distance = bottomOffset - wrap.scrollTop;
        if (!wrap || !(distance > 0)) return;
        const step = () => {
          // 增量小于1的话不会移动
          wrap.scrollTop += Math.ceil(distance / 30);
          if (wrap.scrollTop < bottomOffset) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      });
    },
  },
  created() {},
  beforeMount() {
    const { userId } = socket.query;
    socket.on(userId, msg => {
      console.log('receive: ', msg);
    });
    socket.emit('online-list', 'default', clients => {
      console.log('current clients: ', clients);
    });
    // 接收在线用户信息
    socket.on('online', msg => {
      console.log('online: ', msg);
    });
    socket.on('reply', msg => {
      this.insertMsg(msg);
    });
    // 群聊天
    socket.on('chat', msg => {
      const message = {
        client: msg.meta.client,
        timestamp: msg.meta.timestamp,
        payload: {
          message: msg.data.payload.message,
        },
      };
      this.insertMsg(message);
    });
  },
  mounted() {},
  methods: {
    getMsgSide(client) {
      return client === socket.id ? 'right' : 'left';
    },
    insertMsg(msg) {
      this.msgList.push(msg);
    },
    submit() {
      const { sendMsg } = this;
      if (!sendMsg) {
        this.$message.warning('请输入内容');
        return;
      }
      const msg = {
        client: socket.id,
        target: 'server',
        payload: {
          message: this.sendMsg,
        },
        // timestamp: +new Date(),
      };
      // emit('...', params, callback)
      socket.emit('chat', msg, () => {
        msg.isSuccess = true;
        console.log('send success!');
      });
      console.log('form submit');
      // this.insertMsg(msg);
      this.sendMsg = '';
    },
  },
};

</script>
<style lang="scss">
.repeater {
  // 扩展范围, 以显示侧边在线列表
  grid-area: 1/1/2/3;
  display: grid;
  grid-template-columns: calc(100% - 320px)  300px;
  grid-column-gap: 20px;
  grid-template-areas: 'main side';
  .main-area {
    grid-area: main;
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
  .side-area {
    // position: sticky;
    margin-top: 330px;
    margin-bottom: 10px;
  }
}
</style>
