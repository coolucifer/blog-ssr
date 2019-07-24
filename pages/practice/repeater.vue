<!-- 人类的本质是复读机 -->
<template>
  <div class="repeater">
    <div class="main-area">
      <transition name="fade">
        <div v-if="showMask" class="mask">
          <el-card>
            <h3>输入昵称以连接到服务器</h3>
            <el-form ref="userNameForm" :model="emptyForm" :rules="rules" @submit.native.prevent="submitForm('userNameForm', setUserName)">
              <el-form-item prop="userNameInput">
                <el-input v-model="userName"></el-input>
              </el-form-item>
              <el-button type="primary" size="mini" @click="submitForm('userNameForm', setUserName)">
                确认
              </el-button>
            </el-form>
          </el-card>
        </div>
      </transition>
      <h1>人类的本质是复读机</h1>
      <div class="repeater-body">
        <el-form ref="messageForm" :model="emptyForm" :rules="rules" @submit.native.prevent="submitForm('messageForm', sendMsg)">
          <h3 slot="label">
            输入:
          </h3>
          <el-form-item prop="messageInput">
            <el-input v-model="message" placeholder="请输入消息">
              <el-button slot="append" @click="submitForm('messageForm', sendMsg)">
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
      <div v-for="item in onlineList" :key="item.id" class="online-item">
        <img :src="item.userInfo.avatar || defaultAvatar" alt="" class="avatar">
        <span class="user-name">
          {{ item.userInfo.userName }}
        </span>
      </div>
    </el-card>
  </div>
</template>

<script>
import socket from '@/plugins/socket.io';
import ChatBubble from '@/components/practice/ChatBubble';
import { mapGetters, mapMutations } from 'vuex';
import defaultAvatar from '@/assets/images/default_avatar.jpg';

export default {
  layout: 'blog',
  components: {
    ChatBubble,
  },
  data() {
    return {
      defaultAvatar,
      showMask: true,
      userName: '',
      message: '',
      msgList: [],
      onlineList: [],
      // [Element Warn][Form]model is required for validate to work!
      emptyForm: {},
      rules: {
        userNameInput: [{ validator: this.checkNickname, trigger: 'blur' }],
        messageInput: [{ validator: this.checkMessage, trigger: 'blur' }],
      },
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
    checkNickname(rule, value, callback) {
      const { userName } = this;
      if (!userName) {
        return callback(new Error('昵称不能为空'));
      }
      return callback();
    },
    checkMessage(rule, value, callback) {
      const { message } = this;
      if (!message) {
        return callback(new Error('请输入消息内容'));
      }
      return callback();
    },
    submitForm(formName, callback) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false;
        return callback();
      });
    },
    setUserName() {
      const { userName } = this;
      if (!userName) return;
      this.showMask = false;
      this.updateSocketUserName(userName);
      this.initSocket(userName);
      console.log('set UserName');
    },
    async initSocket(userName) {
      await socket.connect(userName);
      socket.emit('online-list', msg => {
        console.log('current online: ', msg);
        this.onlineList = msg;
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
    sendMsg() {
      const { message } = this;
      if (!message) return;
      const msg = {
        client: socket.id,
        target: 'server',
        payload: {
          message: this.message,
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
      this.message = '';
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
        .el-form {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .el-form-item {
          width: 100%;
          margin-bottom: 0;
        }
        h3 {
          margin-bottom: 10px;
        }
        .el-button {
          margin-top: 10px;
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
    .online-item {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border: 1px solid #ccc;
      user-select: none;
      cursor: pointer;
      .avatar {
        flex-shrink: 0;
        margin-right: 5px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      .user-name {
        flex-grow: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &:nth-child(1) {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      &:nth-last-child(1) {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &:nth-child(n + 2) {
        border-top: none;
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}
</style>
