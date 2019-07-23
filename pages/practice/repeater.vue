<!-- 人类的本质是复读机 -->
<template>
  <div class="repeater">
    <div class="main-area">
      <transition name="fade">
        <div v-if="showMask" class="mask">
          <el-card>
            <h3>输入昵称以连接到服务器</h3>
            <el-form @submit.native.prevent="setUserName">
              <el-form-item>
                <el-input v-model="userName"></el-input>
                <el-button type="primary" size="mini" @click="setUserName">
                  确认
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </transition>
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
import socket from '@/plugins/socket.io';
import ChatBubble from '@/components/practice/ChatBubble';
import { mapGetters, mapMutations } from 'vuex';

export default {
  layout: 'blog',
  components: {
    ChatBubble,
  },
  data() {
    return {
      showMask: true,
      userName: '',
      sendMsg: '',
      msgList: [],
    };
  },
  computed: {
    ...mapGetters('socket', ['socketUserId', 'socketUserName']),
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
  asyncData() {},
  created() {},
  beforeMount() {
    if (this.socketUserName) {
      this.showMask = false;
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('socket', ['updateSocketUserId', 'updateSocketUserName']),
    setUserName() {
      const { userName } = this;
      this.showMask = false;
      this.updateSocketUserName(userName);
      this.initSocket(userName);
      console.log('set UserName');
    },
    async initSocket(userName) {
      await socket.connect(userName);
      socket.emit('online-list', msg => {
        console.log('current online: ', msg);
      });
      console.log('socket: ', socket);
      const { userId } = socket.query;
      this.updateSocketUserId(userId);
      socket.on(userId, msg => {
        console.log('receive: ', msg);
      });
      // 加入
      socket.on('join', msg => {
        console.log('someone joined this room: ', msg);
      });
      // 离开
      socket.on('leave', msg => {
        console.log('someone left this room: ', msg);
      });
      // 接收消息
      socket.on('receive', msg => {
        console.log('receive msg: ', msg);
      });
    },
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
  display: grid;
  grid-area: 1/1/2/3;
  grid-template-areas: 'main side';
  grid-template-columns: calc(100% - 320px)  300px;
  grid-column-gap: 20px;
  .main-area {
    position: relative;
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
    overflow: hidden;
    .mask {
      z-index: 1;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #80808080;
      .el-card {
        width: 50%;
        user-select: none;
        .el-form-item {
          margin-bottom: 0;
        }
        h3 {
          margin-bottom: 10px;
        }
        .el-button {
          margin-top: 10px;
          float: right;
        }
      }
    }
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
  .fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}
</style>
